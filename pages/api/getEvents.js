import { today, week, weekend, twoWeeksDefault } from "@lib/dates";
import { getCalendarEvents } from "@lib/helpers";

const noEventsFound = async (events) => {
  const { from, until } = twoWeeksDefault();

  events = await getCalendarEvents(from, until, false, "", 7);
  events = { ...events, noEventsFound: true };

  return events;
};

export default async function handler(req, res) {
  const { page, q, maxResults } = req.query;

  let events = [];

  switch (page) {
    case "today":
      const { from: fromToday, until: untilToday } = today();

      events = await getCalendarEvents(fromToday, untilToday);

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    case "week":
      const { from: fromWeek, until: toWeek } = week();

      events = await getCalendarEvents(fromWeek, toWeek);

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    case "weekend":
      const { from: fromWeekend, until: toWeekend } = weekend();

      events = await getCalendarEvents(fromWeekend, toWeekend);

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    case "search":
      const fromSearch = new Date();

      events = await getCalendarEvents(fromSearch, null, false, q);

      if (events.noEventsFound) events = await noEventsFound(events);

      break;
    default:
      const { from, until } = twoWeeksDefault();

      events = await getCalendarEvents(from, until, false, q, maxResults);
  }

  try {
    res.status(200).json({
      ...events,
      noEventsFound: events.noEventsFound
        ? events.noEventsFound
        : events.length === 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
