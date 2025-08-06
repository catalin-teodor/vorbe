import { QuartzConfig } from "./quartz/cfg"

import { ContentGraphPlugin } from "./quartz/plugins/content-graph"
import { FileExplorerPlugin } from "./quartz/plugins/explorer"
import { GlobalDataPlugin } from "./quartz/plugins/global-data"
import { TableOfContentsPlugin } from "./quartz/plugins/table-of-contents"
import { GitHubFlavoredMarkdown } from "./quartz/plugins/gfm"
import { SearchPlugin } from "./quartz/plugins/search"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "VoRbE",
    enableSPA: true,
    baseUrl: "https://catalin-teodor.github.io/vorbe",
    theme: {
      typography: "serif",
      colors: "light",
    },
    ignorePatterns: [".obsidian", "templates", "private"],
  },
  plugins: [
    GitHubFlavoredMarkdown(),
    TableOfContentsPlugin(),
    SearchPlugin(),
    GlobalDataPlugin({
      siteTitle: "VoRbE",
      pageLinks: [
        { text: "Articole", link: "/articole" },
        { text: "Gânduri", link: "/ganduri" },
        { text: "Blog", link: "/blog" },
        { text: "Proiecte", link: "/proiecte" },
        { text: "Despre", link: "/despre" },
      ],
    }),
    // ⚠️ elimină ExplorerPlugin() dacă nu vrei bara laterală
    // FileExplorerPlugin(), ← elimină dacă vrei o interfață curată
    ContentGraphPlugin(), // optional: pentru legături între pagini
  ],
}

export default config
