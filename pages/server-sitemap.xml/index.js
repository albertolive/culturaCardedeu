import { getServerSideSitemap } from "next-sitemap";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

const sanitizeText = (text) =>
  `${text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/"/g, "")
    .replace(/,/g, "")
    .replace(/’/g, "'")
    .replace(".", "")
    .replace("%", "")
    .replace("&", "")
    .replace("?", "")
    .replace("¿", "")
    .replace("ª", "a")
    .replace(/\+/g, "")
    .replace(/\|/g, "")
    .replace(/•|/g, "")
    .replace(/·|/g, "")
    .replace(/:/g, "")}`;

export const getServerSideProps = async (ctx) => {
  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 4);
  const until = new Date(now.getFullYear(), now.getMonth() + 4);

  const { events } = await getCalendarEvents(from, until, true, "", 2500);
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  const fields = normalizedEvents?.map((data) => ({
    loc: `${siteUrl}/${data.slug}`,
    lastmod: new Date().toISOString(),
    changefreq: "daily",
    "image:image": `
    <image:loc>${
      data.imageUploaded ? data.imageUploaded : siteUrl + data.images[0]
    }</image:loc>
    <image:title>${sanitizeText(data.title)}</image:title>
  `,
  }));

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
