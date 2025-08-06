import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import { QuartzComponentProps } from "../../components/types"
import { renderPage, pageResources } from "../../components/renderPage"
import BodyConstructor from "../../components/Body"
import { defaultProcessedContent } from "../vfile"
import { FullSlug } from "../../util/path"
import { sharedPageComponents } from "../../../quartz.layout"
//import { Folder } from "../../components"

export const FolderPage: QuartzEmitterPlugin = () => {
  const Body = BodyConstructor()

  const opts = {
    ...sharedPageComponents,
    pageBody: Folder(),
    beforeBody: [],
    left: [],
    right: [],
  }

  const { head: Head, pageBody, footer: Footer } = opts

  return {
    name: "FolderPage",
    getQuartzComponents() {
      return [Head, Body, pageBody, Footer]
    },
    async *emit(ctx: BuildCtx, _content, resources) {
      const cfg = ctx.cfg.configuration

      // fallback slug if nothing provided
      const slug = "folder" as FullSlug

      const [tree, fileData] = defaultProcessedContent({
        slug,
        text: "Folder Listing",
        description: "This is a folder page.",
        frontmatter: { title: "Folder Listing", tags: [] },
      })

      const externalResources = pageResources("/", resources)

      const componentData: QuartzComponentProps = {
        ctx,
        fileData: fileData.data,
        externalResources,
        cfg,
        children: [],
        tree,
        allFiles: [],
      }

      yield write({
        ctx,
        content: renderPage(cfg, slug, componentData, opts, externalResources),
        slug,
        ext: ".html",
      })
    },
    async *partialEmit() {},
  }
}