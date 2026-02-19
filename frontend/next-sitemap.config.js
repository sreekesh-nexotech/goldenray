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
    // Custom priorities and change frequencies based on your requirements
    const customPaths = {
      "/": {
        priority: 1.0,
        changefreq: "weekly",
      },
      "/residential": {
        priority: 0.9,
        changefreq: "monthly",
      },
      "/commercial": {
        priority: 0.9,
        changefreq: "monthly",
      },
      "/solutions": {
        priority: 0.8,
        changefreq: "monthly",
      },
      "/projects": {
        priority: 0.8,
        changefreq: "monthly",
      },
      "/about": {
        priority: 0.7,
        changefreq: "yearly",
      },
      "/contactus": {
        priority: 0.7,
        changefreq: "yearly",
      },
      "/faq": {
        priority: 0.6,
        changefreq: "monthly",
      },
      "/privacy": {
        priority: 0.3,
        changefreq: "yearly",
      },
      "/terms": {
        priority: 0.3,
        changefreq: "yearly",
      },
    };

    const custom = customPaths[path];
    if (custom) {
      return {
        loc: path,
        changefreq: custom.changefreq,
        priority: custom.priority,
        lastmod: new Date().toISOString().split("T")[0],
      };
    }

    // Return null for paths not in our list (will be excluded)
    return null;
  },
};
