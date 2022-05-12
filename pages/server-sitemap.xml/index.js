import { getServerSideSitemap } from "next-sitemap";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

export const getServerSideProps = async (ctx) => {
  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = now;
  const until = new Date(now.getFullYear(), now.getMonth() + 2);

  const { events } = await getCalendarEvents(from, until, true);
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  const fields = normalizedEvents?.map((data) => ({
    loc: `${siteUrl}${data.slug}`,
    lastmod: new Date().toISOString(),
    changefreq: "weekly",
    "image:image": `
    <image:loc>${siteUrl}${data.images[0]}</image:loc>
    <image:title>${data.title}</image:title>
  `,
  }));

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
