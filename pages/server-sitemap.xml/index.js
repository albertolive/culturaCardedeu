import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = now;
  const until = new Date(now.getFullYear(), now.getMonth() + 3);

  const { events } = await getCalendarEvents(from, until);
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return getServerSideSitemap(ctx, normalizedEvents);
};

export default function Site() {}
