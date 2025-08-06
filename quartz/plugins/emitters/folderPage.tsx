import { QuartzEmitterPlugin } from "../types"
import { FullSlug, pathToRoot } from "../../util/path"
//import { FolderList } from "../../components"
import { pageResources, renderPage } from "../../components/renderPage"
import { write } from "./helpers"
import { defaultContentPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { defaultProcessedContent } from "../vfile"
import { QuartzComponentProps } from "../../components/types"
import { BuildCtx } from "../../util/ctx"

export const FolderPage: QuartzEmitterPlugin = () => {
  const opts = {
    ...sharedPageComponents,
    ...defaultContentPageLayout,
    //pageBody: FolderList(),
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
      const cfg = ctx.cfg.configuration
      const folderData = ctx.folderContent

      for (const [folder, files] of Object.entries(folderData)) {
        const slug = (folder.endsWith("/") ? folder : folder + "/") as FullSlug

        const [_, file] = defaultProcessedContent({
          slug,
          text: `Folder: ${folder}`,
          description: `Posts and notes inside ${folder}`,
          frontmatter: { title: folder, tags: [] },
        })

        const externalResources = pageResources(pathToRoot(slug), resources)

        const componentData: QuartzComponentProps = {
          ctx,
          cfg,
          fileData: file.data,
          externalResources,
          tree: files,
          allFiles: [],
          children: [],
        }

        yield write({
          ctx,
          content: renderPage(cfg, slug, componentData, opts, externalResources),
          slug,
          ext: ".html",
        })
      }
    },
    async *partialEmit() {},
  }
}