import { normalizeEvent, normalizeEvents } from "@utils/normalize";

const now = new Date();

const randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const filterByDateFn = (items) =>
  items
    .map((item) => {
      const startDate = new Date(item.start.dateTime);

      if (startDate < now) {
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          startDate.getHours(),
          startDate.getMinutes()
        );

        return {
          ...item,
          start: { dateTime: today },
          originalStartDate: item.start.dateTime,
        };
      }

      return item;
    })
    .sort((a, b) => {
      return new Date(a.start.dateTime) - new Date(b.start.dateTime);
    })
    .map((item) => {
      if (item.originalStartDate) {
        return {
          ...item,
          start: { dateTime: item.originalStartDate },
        };
      }
      return item;
    });

const normalizeItems = (item, normalizeRss) =>
  normalizeRss ? normalizeEvent(item) : normalizeEvents(item);

export async function getCalendarEvent(eventId) {
  if (!eventId) return { event: [] };

  const normalizedEventId = eventId.split(/[-]+/).pop();
  const url = `https://www.googleapis.com/calendar/v3/calendars/8e1jse11ireht56ho13r6a470s@group.calendar.google.com/events/${normalizedEventId}?key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}`;
  const res = await fetch(url);
  const json = await res.json();
  const normalizedEvent = normalizeEvent(json);

  return { event: normalizedEvent };
}

export async function getCalendarEvents({
  from,
  until,
  normalizeRss = false,
  q = "",
  maxResults = 50,
  filterByDate = true,
}) {
  const fromDate = from.toISOString();
  const untilDate = until ? `&timeMax=${until.toISOString()}` : "";
  const query = q ? `&q=${q}` : "";
  const url = `https://www.googleapis.com/calendar/v3/calendars/8e1jse11ireht56ho13r6a470s@group.calendar.google.com/events?timeMin=${fromDate}${untilDate}${query}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}`;

  const res = await fetch(url);
  const json = await res.json();

  let normalizedEvents;

  try {
    normalizedEvents = json?.items
      ? filterByDate
        ? filterByDateFn(json.items).map((item) =>
            normalizeItems(item, normalizeRss)
          )
        : json.items.map((item) => normalizeItems(item, normalizeRss))
      : [];
  } catch (e) {
    console.error(e);
    return [];
  }

  if (normalizedEvents.length) {
    const adEvent = (id) => ({
      id,
      isAd: true,
    });

    normalizedEvents.length &&
      normalizedEvents.splice(randomIntFromInterval(0, 5), 0, adEvent(1));
    normalizedEvents.length >= 9 &&
      normalizedEvents.splice(randomIntFromInterval(9, 14), 0, adEvent(2));
    normalizedEvents.length >= 16 &&
      normalizedEvents.splice(randomIntFromInterval(16, 25), 0, adEvent(3));
  }

  return {
    events: normalizedEvents,
    noEventsFound: normalizedEvents.length === 0,
  };
}
