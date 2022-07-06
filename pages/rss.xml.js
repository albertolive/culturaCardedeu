import { Feed } from "feed";

const getAllArticles = async () => {
  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = new Date();
  const until = new Date(now.setDate(now.getDate() + 7));

  const { events } = await getCalendarEvents(from, until, true);
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return normalizedEvents;
};

const hostUrl = "https://www.culturacardedeu.com";

const buildFeed = (items) => {
  const feed = new Feed({
    id: hostUrl,
    link: hostUrl,
    title: "Cultura Cardedeu",
    description: "Calendari col·laboratiu dels actes culturals de Cardedeu",
    copyright: "Cultura Cardedeu",
    updated: new Date(items[0].startDate),
    author: {
      name: "Cultura Cardedeu",
      link: hostUrl,
    },
  });

  const removedDuplicatedItems = items.filter(
    (v, i, a) =>
      a.findIndex((v2) => v2.id.split("_")[0] === v.id.split("_")[0]) === i
  );

  removedDuplicatedItems.forEach((item) => {
    feed.addItem({
      title: item.title,
      link: `${hostUrl}/${item.slug}`,
      description: item.description,
      date: new Date(item.startDate),
    });
  });

  return feed;
};

export const getServerSideProps = async (context) => {
  if (context && context.res) {
    const { res } = context;

    const articles = await getAllArticles();

    const feed = buildFeed(articles);
    res.setHeader("content-type", "text/xml");
    res.write(feed.rss2()); // NOTE: You can also use feed.atom1() or feed.json1() for other feed formats
    res.end();
  }

  return {
    props: {},
  };
};

const RssPage = () => null;

export default RssPage;
