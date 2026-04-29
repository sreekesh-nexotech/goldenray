// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.flarize.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: "./public",
  exclude: [
    "/manifest.json",
    "/icon0.svg",
    "/icon1.png",
    "/apple-icon.png",
    "/api/*",
    "/advanced-calculator",
    "/industrial",
    "/quotation",
    "/subsidy",
    "/resources",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/manifest.json"],
      },
    ],
  },
  transform: async (config, path) => {
  const customPaths = {
    "/": {
      priority: 1.0,
    },

    "/residential": {
      priority: 0.8,
    },
    "/commercial": {
      priority: 0.8,
    },
    "/projects": {
      priority: 0.8,
    },
    "/blog": {
      priority: 0.8,
    },
    "/about": {
      priority: 0.8,
    },
    "/contactus": {
      priority: 0.8,
    },
    "/solutions": {
      priority: 0.8,
    },
    "/faq": {
      priority: 0.8,
    },
    "/privacy": {
      priority: 0.8,
    },
    "/terms": {
      priority: 0.8,
    },

    "/blog/solar-installation-timeline": {
      priority: 0.64,
    },
    "/blog/monocrystalline-vs-polycrystalline": {
      priority: 0.64,
    },
    "/blog/solar-subsidy-in-kerala-2026-complete-guide-to-pm-surya-ghar-yojana": {
      priority: 0.64,
    },
    "/blog/sharma-family-case-study": {
      priority: 0.64,
    },
    "/blog/string-vs-power-optimizers": {
      priority: 0.64,
    },
    "/blog/how-to-calculate-solar-roi-in-kerala": {
      priority: 0.64,
    },
    "/subsidy": {
      priority: 0.64,
    },
    "/advanced-calculator": {
      priority: 0.64,
    },

    "/blog/which-solar-panel-is-best-for-your-home-in-india": {
      priority: 0.51,
    },
    "/blog/on-grid-vs-hybrid-solar-kerala": {
      priority: 0.51,
    },
  };

  const custom = customPaths[path];

  return {
    loc: path,
    priority: custom?.priority || 0.7,
    lastmod: new Date().toISOString(),
  };
},
};
