import { FolderContentMap, QuartzPluginData } from "../vfile"
import { QuartzEmitterPlugin } from "../types"
import { FullSlug, pathToRoot } from "../../util/path"
import { FolderList } from "../../components"
import { defaultContentPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { pageResources, renderPage } from "../../components/renderPage"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import { QuartzComponentProps } from "../../components/types"

export const FolderPage: QuartzEmitterPlugin = () => {
  const opts = {
    ...sharedPageComponents,
    ...defaultContentPageLayout,
    pageBody: FolderList(),
    beforeBody: [],
    left: [],
    right: [],
    afterBody: [],
  }

  const { head: Head, pageBody, footer: Footer } = opts
  const Body = opts.pageBody

  return {
    name: "FolderPage",
    getQuartzComponents() {
      return [Head, Body, pageBody, Footer]
    },
    async *emit(ctx, _content, resources) {
      const folderData = ctx.folderContent
      const cfg = ctx.cfg.configuration

      for (const [folder, files] of Object.entries(folderData)) {
        const slug = (folder.endsWith("/") ? folder : folder + "/") as FullSlug

        const componentData: QuartzComponentProps = {
          ctx,
          fileData: {
            slug,
            frontmatter: { title: folder },
            tags: [],
          } as QuartzPluginData,
          externalResources: pageResources(pathToRoot(slug), resources),
          cfg,
          children: [],
          tree: files,
          allFiles: [],
        }

        yield write({
          ctx,
          content: renderPage(cfg, slug, componentData, opts, componentData.externalResources),
          slug,
          ext: ".html",
        })
      }
    },
    async *partialEmit() {},
  }
}