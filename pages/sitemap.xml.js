import fs from "fs";
import { server } from "../config";

const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const baseUrl = server;

  const staticPages = fs
    .readdirSync(
      {
        development: "pages",
        production: "./",
      }[process.env.NODE_ENV]
    )
    .filter((staticPage) => {
      return ![
        "api",
        "_app.js",
        "_document.js",
        "404.js",
        "_error.js",
        "sitemap.xml.js",
        ".next",
        "___next_launcher.js",
        "___vc",
        "node_modules",
        "package.json",
        "[eventId]",
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${baseUrl}/${staticPagePath}`;
    });

  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = now;
  const until = new Date(now.getFullYear(), now.getMonth() + 3);
  console.log("FROM UNTIL", from, until);
  const { events } = await getCalendarEvents(from, until);
  const normalizedEvents = JSON.parse(JSON.stringify(events));
  console.log("staticPages", staticPages);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map((url) => {
          return `
            <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
            </url>
          `;
        })
        .join("")}
        ${normalizedEvents
          .map(({ slug }) => {
            return `
                <url>
                  <loc>${baseUrl}/${slug}</loc>
                  <lastmod>${new Date().toISOString()}</lastmod>
                </url>
              `;
          })
          .join("")}
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
