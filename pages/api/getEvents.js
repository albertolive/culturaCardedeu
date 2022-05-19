import { getCalendarEvents } from "@lib/helpers";
import { nextDay, isWeekend } from "@utils/helpers";

export default async function handler(req, res) {
  const { page } = req.query;

  let events = [];

  switch (page) {
    case "today":
      const fromToday = new Date();
      const untilToday = new Date();
      untilToday.setHours(24);
      untilToday.setMinutes(0);
      events = await getCalendarEvents(fromToday, untilToday);
      break;
    case "week":
      const fromWeek = new Date();
      const toWeek = nextDay(0);
      events = await getCalendarEvents(fromWeek, toWeek);
      break;
    case "weekend":
      const fromWeekend = isWeekend() ? new Date() : nextDay(5);
      const toWeekend = nextDay(0);
      events = await getCalendarEvents(fromWeekend, toWeekend);
      break;
    default:
      const now = new Date();
      const from = new Date();
      const until = new Date(now.setDate(now.getDate() + 15));

      events = await getCalendarEvents(from, until);
  }

  try {
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
  }
}
