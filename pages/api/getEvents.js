import { today, week, weekend, twoWeeksDefault } from "@lib/dates";
import { getCalendarEvents } from "@lib/helpers";

export default async function handler(req, res) {
  const { page, q, maxResults } = req.query;

  let events = [];

  switch (page) {
    case "today":
      const { from: fromToday, until: untilToday } = today();

      events = await getCalendarEvents(fromToday, untilToday);
      break;
    case "week":
      const { from: fromWeek, until: toWeek } = week();

      events = await getCalendarEvents(fromWeek, toWeek);
      break;
    case "weekend":
      const { from: fromWeekend, until: toWeekend } = weekend();

      events = await getCalendarEvents(fromWeekend, toWeekend);
      break;
    case "search":
      const fromSearch = new Date();

      events = await getCalendarEvents(fromSearch, null, false, q);
      break;
    default:
      const { from, until } = twoWeeksDefault();

      events = await getCalendarEvents(from, until, false, q, maxResults);
  }

  try {
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
  }
}
