import { Feed } from "feed";
import * as Sentry from "@sentry/nextjs";

// Assuming getNewsSummaries and normalizeEvent are correctly imported or defined elsewhere
// For example, if they are in lib/helpers.js and utils/normalize.js respectively:
const { getNewsSummaries } = require("@lib/helpers"); // Adjust path as needed
const { normalizeEvent } = require("@utils/normalize"); // Adjust path as needed

const getAllNewsArticles = async (maxResults = 25) => {
  // Default to 25 news items
  try {
    const { newsSummaries, noEventsFound } = await getNewsSummaries({
      maxResults,
    });

    if (noEventsFound) {
      return [];
    }
    // The getNewsSummaries already seems to normalize items using normalizeEvent
    // If further specific normalization for RSS is needed, it can be done here.
    // For now, we assume newsSummaries are in a suitable format.
    const normalizedNews = JSON.parse(JSON.stringify(newsSummaries));
    return normalizedNews;
  } catch (error) {
    console.error("Error in getAllNewsArticles:", error);
    Sentry.captureException(error);
    return [];
  }
};

const hostUrl = "https://www.culturacardedeu.com";

const buildNewsFeed = (items) => {
  const feed = new Feed({
    id: `${hostUrl}/noticies`, // Unique ID for the news feed
    link: `${hostUrl}/noticies`, // Link to the news section (if different, adjust)
    title: "Notícies de Cultura Cardedeu",
    description: "Les últimes notícies i actualitzacions culturals de Cardedeu",
    copyright: "Cultura Cardedeu",
    updated: items.length > 0 ? new Date(items[0].startDate) : new Date(), // Use first item's date or now
    author: {
      name: "Cultura Cardedeu",
      link: hostUrl,
    },
  });

  // Assuming news items don't have 'isAd' and duplication logic might be different or not needed.
  // If news items can be ads or have duplicates like events, this logic needs to be adapted.
  // For now, we'll iterate through all fetched items.
  items.forEach((item) => {
    // Adjust the description and content based on news item structure
    // The existing event RSS uses:
    // const description = `${item.title}\n\n🗓️ ${item.nameDay} ${item.formattedStart}\n\n🏡 ${item.location} \n\nℹ️ No et perdis aquest i altres esdeveniments! Fes clic al nostre perfil per trobar l'enllaç a la nostra pàgina web i descobrir-los!`;
    // For news, this might be simpler, perhaps just the summary or a snippet.
    // Assuming 'item.description' contains the news summary/content.

    let newsDescription = item.title; // Default to title
    if (item.description) {
      // Strip HTML tags from description for the feed description
      newsDescription =
        item.description.replace(/<[^>]*>/g, "").substring(0, 250) + "...";
    }

    const regex = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/g;
    let eventImage = null;
    if (item.description) {
      const hasEventImage = item.description.match(regex);
      eventImage = hasEventImage && hasEventImage[0];
    }

    feed.addItem({
      id: item.id, // Ensure news items have a unique ID
      title: item.title,
      link: `${hostUrl}/noticies/${item.slug}`, // Assuming news items have slugs and a path like /noticies/:slug
      description: newsDescription, // Use the generated news description
      content: item.description, // Full content, possibly HTML
      date: new Date(item.startDate), // Ensure news items have a startDate or similar date field
      image: item.imageUploaded
        ? item.imageUploaded
        : eventImage
        ? eventImage
        : item.images && item.images.length > 0
        ? `${hostUrl}${item.images[0]}`
        : `${hostUrl}/static/images/logo-cultura-cardedeu.png`, // Fallback image
    });
  });

  return feed;
};

export const getServerSideProps = async (context) => {
  if (context && context.res) {
    const { res, query } = context;
    // const days = query.until || 14; // 'days' might not be relevant for news, using maxResults instead
    const maxResults = query.max || 25; // Allow overriding maxResults via query param

    const newsArticles = await getAllNewsArticles(Number(maxResults));

    if (!newsArticles || newsArticles.length === 0) {
      res.statusCode = 404;
      res.end("No news articles found");
      return { props: {} };
    }

    const feed = buildNewsFeed(newsArticles);
    res.setHeader("content-type", "text/xml");
    res.write(feed.rss2());
    res.end();
  }

  return {
    props: {},
  };
};

const NewsRssPage = () => null;

export default NewsRssPage;
