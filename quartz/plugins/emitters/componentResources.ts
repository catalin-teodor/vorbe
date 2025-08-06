import { QuartzEmitterPlugin } from "../types"
import { QuartzComponent } from "../../components/types"
import { BuildCtx } from "../../util/ctx"
import { googleFontHref, googleFontSubsetHref, joinStyles, processGoogleFonts } from "../../util/theme"
import { FullSlug, joinSegments } from "../../util/path"
import { transform as transpile } from "esbuild"
import { Features, transform } from "lightningcss"
import { write } from "./helpers"

// @ts-ignore
import spaRouterScript from "../../components/scripts/spa.inline"
// @ts-ignore
import popoverScript from "../../components/scripts/popover.inline"
import styles from "../../styles/custom.scss"
import popoverStyle from "../../components/styles/popover.scss"

type ComponentResources = {
  css: string[]
  beforeDOMLoaded: string[]
  afterDOMLoaded: string[]
}

function getComponentResources(ctx: BuildCtx): ComponentResources {
  try {
    const allComponents = new Set<QuartzComponent>()
    for (const emitter of ctx.cfg.plugins.emitters ?? []) {
      const components = emitter?.getQuartzComponents?.(ctx) ?? []
      for (const component of components) {
        if (component) allComponents.add(component)
      }
    }

    const css = new Set<string>()
    const beforeDOMLoaded = new Set<string>()
    const afterDOMLoaded = new Set<string>()

    for (const component of allComponents) {
      const norm = (val: string | string[] | undefined): string[] =>
        val == null ? [] : Array.isArray(val) ? val : [val]

      norm(component.css).forEach((c) => css.add(c))
      norm(component.beforeDOMLoaded).forEach((s) => beforeDOMLoaded.add(s))
      norm(component.afterDOMLoaded).forEach((s) => afterDOMLoaded.add(s))
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
  const script = scripts.map((script) => `(function () {${script}})();`).join("\n")
  const res = await transpile(script, { minify: true })
  return res.code
}

function addGlobalPageResources(ctx: BuildCtx, componentResources: ComponentResources) {
  const cfg = ctx.cfg.configuration
  if (cfg.enablePopovers) {
    componentResources.afterDOMLoaded.push(popoverScript)
    componentResources.css.push(popoverStyle)
  }

  if (cfg.enableSPA) {
    componentResources.afterDOMLoaded.push(spaRouterScript)
  } else {
    componentResources.afterDOMLoaded.push(`
      window.spaNavigate = (url, _) => window.location.assign(url)
      window.addCleanup = () => {}
      const event = new CustomEvent("nav", { detail: { url: document.body.dataset.slug } })
      document.dispatchEvent(event)
    `)
  }
}

export const ComponentResources: QuartzEmitterPlugin = () => {
  return {
    name: "ComponentResources",
    async *emit(ctx) {
      const cfg = ctx.cfg.configuration
      const componentResources = getComponentResources(ctx)

      let googleFontsStyleSheet = ""
      if (cfg.theme.fontOrigin === "googleFonts" && !cfg.theme.cdnCaching) {
        const theme = cfg.theme
        const response = await fetch(googleFontHref(theme))
        googleFontsStyleSheet = await response.text()

        if (theme.typography.title) {
          const response = await fetch(googleFontSubsetHref(theme, cfg.pageTitle))
          googleFontsStyleSheet += `\n${await response.text()}`
        }

        if (!cfg.baseUrl) {
          throw new Error("baseUrl must be defined when using Google Fonts without cdnCaching")
        }

        const { processedStylesheet, fontFiles } = await processGoogleFonts(googleFontsStyleSheet, cfg.baseUrl)
        googleFontsStyleSheet = processedStylesheet

        for (const fontFile of fontFiles) {
          const res = await fetch(fontFile.url)
          if (!res.ok) throw new Error(`Failed to fetch font ${fontFile.filename}`)

          const buf = await res.arrayBuffer()
          yield write({
            ctx,
            slug: joinSegments("static", "fonts", fontFile.filename) as FullSlug,
            ext: `.${fontFile.extension}`,
            content: Buffer.from(buf),
          })
        }
      }

      addGlobalPageResources(ctx, componentResources)

      const stylesheet = joinStyles(
        cfg.theme,
        googleFontsStyleSheet,
        ...componentResources.css,
        styles,
      )

      const [prescript, postscript] = await Promise.all([
        joinScripts(componentResources.beforeDOMLoaded),
        joinScripts(componentResources.afterDOMLoaded),
      ])

      yield write({
        ctx,
        slug: "index" as FullSlug,
        ext: ".css",
        content: transform({
          filename: "index.css",
          code: Buffer.from(stylesheet),
          minify: true,
          targets: {
            safari: (15 << 16) | (6 << 8),
            ios_saf: (15 << 16) | (6 << 8),
            edge: 115 << 16,
            firefox: 102 << 16,
            chrome: 109 << 16,
          },
          include: Features.MediaQueries,
        }).code.toString(),
      })

      yield write({ ctx, slug: "prescript" as FullSlug, ext: ".js", content: prescript })
      yield write({ ctx, slug: "postscript" as FullSlug, ext: ".js", content: postscript })
    },
    async *partialEmit() {},
  }
}