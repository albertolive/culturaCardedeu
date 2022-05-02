const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
module.exports = {
  siteUrl,
  exclude: [
    "api",
    "_app.js",
    "_document.js",
    "404.js",
    "_error.js",
    "sitemap.xml.js",
    "server-sitemap.xml",
    "server-sitemap.xml.js",
    ".next",
    "___next_launcher.js",
    "___vc",
    "node_modules",
    "package.json",
    "[eventId]",
  ],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/404"],
      },
      { userAgent: "*", allow: "/" },
    ],
    additionalSitemaps: [
      `${siteUrl}sitemap.xml`,
      `${siteUrl}server-sitemap.xml`,
    ],
  },
};