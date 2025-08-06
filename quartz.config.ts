import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "VoRbE",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible", // opțional
    },
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
    Plugin.frontmatter(),
    Plugin.syntaxHighlighting(),
    Plugin.gitHubFlavoredMarkdown(),
    Plugin.externalLinks(),
    Plugin.categorize({
      strategy: "folder", // folosește structura de foldere ca categorii
    }),
    Plugin.search(),
    Plugin.tableOfContents(),
    Plugin.tag(),
    Plugin.date({
      dateType: "modified",
    }),
    Plugin.emoji(),
    Plugin.lastUpdated(),

    // elimină pluginul Explorer pentru a nu mai apărea în sidebar
    Plugin.globalData({
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
