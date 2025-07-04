import { withSentry } from "@sentry/nextjs";

import { today, week, weekend, twoWeeksDefault } from "@lib/dates";
import { getCalendarEvents, getNewsSummaries } from "@lib/helpers";

const noEventsFound = async (events) => {
  const { from, until } = twoWeeksDefault();

  events = await getCalendarEvents({ from, until, maxResults: 7 });
  events = { ...events, noEventsFound: true };

  return events;
};

const handler = async (req, res) => {
  const { page, q, maxResults, pageToken, pageNum } = req.query;
  const pageNumber = parseInt(pageNum) || parseInt(page) || 0;
  const resultsPerPage = parseInt(maxResults) || 10;

  let events = [];

  switch (page) {
    case "today":
      const { from: fromToday, until: untilToday } = today();

      events = await getCalendarEvents({ from: fromToday, until: untilToday });

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    case "week":
      const { from: fromWeek, until: toWeek } = week();

      events = await getCalendarEvents({ from: fromWeek, until: toWeek });

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    case "weekend":
      const { from: fromWeekend, until: toWeekend } = weekend();

      events = await getCalendarEvents({ from: fromWeekend, until: toWeekend });

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    case "search":
      const fromSearch = new Date();

      events = await getCalendarEvents({ from: fromSearch, q });

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    case "news":
      // Fetch a reasonable batch and apply consistent pagination logic
      const newsData = await getNewsSummaries({ maxResults: 20 });

      if (newsData.newsSummaries && newsData.newsSummaries.length > 0) {
        // Apply pagination: return only the items for the current page
        const startIndex = pageNumber * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const paginatedNews = newsData.newsSummaries.slice(
          startIndex,
          endIndex
        );

        events = {
          ...newsData,
          newsSummaries: paginatedNews,
          hasMore: newsData.newsSummaries.length > endIndex,
          totalCount: newsData.newsSummaries.length,
          currentPage: pageNumber,
        };
      } else {
        events = newsData;
      }
      break;
    default:
      const from = new Date();

      events = await getCalendarEvents({
        from,
        q,
        maxResults: (pageNumber + 1) * resultsPerPage,
      });
  }

  try {
    res.setHeader("Cache-Control", "max-age=1800");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      ...events,
      noEventsFound: events.noEventsFound
        ? events.noEventsFound
        : events.events
        ? events.events.length === 0
        : events.length === 0,
      currentYear: new Date().getFullYear(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export default withSentry(handler);
