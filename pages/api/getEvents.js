import { getCalendarEvents } from "@lib/helpers";
import { nextDay, isWeekend, convertTZ } from "@utils/helpers";

const dayLightSaving = 2;

export default async function handler(req, res) {
  const { page } = req.query;

  let events = [];

  switch (page) {
    case "today":
      const fromToday = new Date();
      const untilToday = new Date();

      untilToday.setHours(24 + dayLightSaving);
      untilToday.setMinutes(0);
      untilToday.setSeconds(0);

      events = await getCalendarEvents(fromToday, untilToday);
      break;
    case "week":
      const fromWeek = new Date();
      const toWeek = nextDay(0);

      toWeek.setHours(24 + dayLightSaving);
      toWeek.setMinutes(0);
      toWeek.setSeconds(0);

      events = await getCalendarEvents(fromWeek, toWeek);
      break;
    case "weekend":
      let fromWeekend = nextDay(5);

      if (isWeekend()) {
        fromWeekend = new Date();
      } else {
        fromWeekend.setHours(6 + dayLightSaving);
        fromWeekend.setMinutes(0);
        fromWeekend.setSeconds(0);
      }

      const toWeekend = nextDay(0);

      toWeekend.setHours(24 + dayLightSaving);
      toWeekend.setMinutes(0);
      toWeekend.setSeconds(0);

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
