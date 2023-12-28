import { Feed } from "feed";

const getAllArticles = async (days = 14) => {
  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = new Date();
  const until = new Date(now.setDate(now.getDate() + days));

  const { events } = await getCalendarEvents({
    from,
    until,
    normalizeRss: true,
    filterByDate: false,
    maxResults: 2500,
  });
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

  const removedDuplicatedItems = items
    .filter((event) => !event.isAd)
    .filter(
      (v, i, a) =>
        a.findIndex((v2) => v2.id.split("_")[0] === v.id.split("_")[0]) === i
    );

  removedDuplicatedItems.forEach((item) => {
    const description = `${item.title}\n\n🗓️ ${item.nameDay} ${item.formattedStart}\n\n🏡 ${item.location} \n\nℹ️ No et perdis aquest i altres esdeveniments! Fes clic al nostre perfil per trobar l'enllaç a la nostra pàgina web i descobrir-los!`;
    const regex = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/g;
    const hasEventImage = item.description.match(regex);
    const eventImage = hasEventImage && hasEventImage[0];

    feed.addItem({
      id: item.id,
      title: item.title,
      link: `${hostUrl}/${item.slug}`,
      description,
      content: item.location,
      date: new Date(item.startDate),
      image: item.imageUploaded
        ? item.imageUploaded
        : eventImage
        ? eventImage
        : `${hostUrl}${item.images[0]}`,
    });
  });

  return feed;
};

export const getServerSideProps = async (context) => {
  if (context && context.res) {
    const { res, query } = context;
    const days = query.until || 14;

    const articles = await getAllArticles(days);

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
