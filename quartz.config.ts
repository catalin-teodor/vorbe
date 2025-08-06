import { QuartzConfig } from "./quartz/cfg"

import { GitHubFlavoredMarkdown } from "./quartz/plugins/transformers/gfm"
import { SyntaxHighlighting } from "./quartz/plugins/transformers/syntax"
import { TableOfContents } from "./quartz/plugins/transformers/toc"
import { EmojiTransform } from "./quartz/plugins/transformers/emoji"
import { LastUpdatedTransform } from "./quartz/plugins/transformers/lastUpdated"
import { DateTransform } from "./quartz/plugins/transformers/date"

import { TagPlugin } from "./quartz/plugins/features/tag"
import { SearchPlugin } from "./quartz/plugins/features/search"
import { CategorizePlugin } from "./quartz/plugins/features/categorize"
import { GlobalDataPlugin } from "./quartz/plugins/features/globalData"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "VoRbE",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    locale: "ro-RO",
    baseUrl: "https://catalin-teodor.github.io/vorbe",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      typography: "raleway",
      colors: "light",
      fontSize: "medium",
    },
  },

  plugins: [
    GitHubFlavoredMarkdown(),
    SyntaxHighlighting(),
    TableOfContents(),
    EmojiTransform(),
    LastUpdatedTransform(),
    DateTransform({ dateType: "modified" }),
    TagPlugin(),
    SearchPlugin(),
    CategorizePlugin({ strategy: "folder" }),
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
  ],
}

export default config
