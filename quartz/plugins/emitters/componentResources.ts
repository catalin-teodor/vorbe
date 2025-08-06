// quartz/plugins/emitters/componentResources.ts
import { QuartzEmitterPlugin } from "../types"
import { QuartzComponent } from "../../components/types"
import { BuildCtx } from "../../util/ctx"
import { write } from "./helpers"
import styles from "../../styles/custom.scss"
import spaRouterScript from "../../components/scripts/spa.inline"
import popoverScript from "../../components/scripts/popover.inline"
import popoverStyle from "../../components/styles/popover.scss"
import { joinStyles, googleFontHref, processGoogleFonts } from "../../util/theme"
import { transform as transpile } from "esbuild"
import { transform } from "lightningcss"
import { FullSlug, joinSegments } from "../../util/path"

type ComponentResources = {
  css: string[]
  beforeDOMLoaded: string[]
  afterDOMLoaded: string[]
}

function normalize(resource: unknown): string[] {
  if (!resource) return []
  if (Array.isArray(resource)) return resource
  if (typeof resource === "string") return [resource]
  return []
}

function getComponentResources(ctx: BuildCtx): ComponentResources {
  try {
    const allComponents = new Set<QuartzComponent>()
    for (const emitter of ctx.cfg.plugins.emitters) {
      const components = emitter.getQuartzComponents?.(ctx) ?? []
      for (const component of components) {
        allComponents.add(component)
      }
    }

    const css = new Set<string>()
    const beforeDOMLoaded = new Set<string>()
    const afterDOMLoaded = new Set<string>()

    for (const component of allComponents) {
      normalize(component.css).forEach((c) => css.add(c))
      normalize(component.beforeDOMLoaded).forEach((b) => beforeDOMLoaded.add(b))
      normalize(component.afterDOMLoaded).forEach((a) => afterDOMLoaded.add(a))
    }

    return {
      css: [...css],
      beforeDOMLoaded: [...beforeDOMLoaded],
      afterDOMLoaded: [...afterDOMLoaded],
    }
  } catch (e) {
    console.warn("⚠️ getComponentResources error:", e)
    return {
      css: [],
      beforeDOMLoaded: [],
      afterDOMLoaded: [],
    }
  }
}

async function joinScripts(scripts: string[]): Promise<string> {
  const joined = scripts.map((s) => `(function () {${s}})();`).join("\n")
  return (await transpile(joined, { minify: true })).code
}

export const ComponentResources: QuartzEmitterPlugin = () => {
  return {
    name: "ComponentResources",
    async *emit(ctx) {
      const cfg = ctx.cfg.configuration
      const resources = getComponentResources(ctx)

      if (cfg.enablePopovers) {
        resources.afterDOMLoaded.push(popoverScript)
        resources.css.push(popoverStyle)
      }

      if (cfg.enableSPA) {
        resources.afterDOMLoaded.push(spaRouterScript)
      }

      const stylesheet = joinStyles(cfg.theme, "", ...resources.css, styles)

      const [prescript, postscript] = await Promise.all([
        joinScripts(resources.beforeDOMLoaded),
        joinScripts(resources.afterDOMLoaded),
      ])

      yield write({
        ctx,
        slug: "index" as FullSlug,
        ext: ".css",
        content: transform({
          filename: "index.css",
          code: Buffer.from(stylesheet),
          minify: true,
        }).code.toString(),
      })

      yield write({ ctx, slug: "prescript" as FullSlug, ext: ".js", content: prescript })
      yield write({ ctx, slug: "postscript" as FullSlug, ext: ".js", content: postscript })
    },
    async *partialEmit() {},
  }
}