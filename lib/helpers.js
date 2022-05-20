import { normalizeEvent, normalizeEvents } from "@utils/normalize";

export async function getCalendarEvent(eventId) {
  if (!eventId) return { event: [] };

  const normalizedEventId = eventId.split(/[-]+/).pop();
  const url = `https://www.googleapis.com/calendar/v3/calendars/8e1jse11ireht56ho13r6a470s@group.calendar.google.com/events/${normalizedEventId}?key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}`;
  const res = await fetch(url);
  const json = await res.json();
  const normalizedEvent = normalizeEvent(json);

  return { event: normalizedEvent };
}

export async function getCalendarEvents(
  from,
  until,
  normalizeRss = false,
  q = ""
) {
  const fromDate = from.toISOString();
  const untilDate = until ? `&timeMax=${until.toISOString()}` : "";
  const query = q ? `&q=${q}` : "";
  const url = `https://www.googleapis.com/calendar/v3/calendars/8e1jse11ireht56ho13r6a470s@group.calendar.google.com/events?timeMin=${fromDate}${untilDate}${query}&singleEvents=true&orderBy=startTime&maxResults=50&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}`;

  const res = await fetch(url);
  const json = await res.json();

  let normalizedEvents;

  try {
    normalizedEvents = json?.items
      ? json.items.map((item) =>
          normalizeRss ? normalizeEvent(item) : normalizeEvents(item)
        )
      : [];
  } catch (e) {
    console.error(e);
  }

  return { events: normalizedEvents };
}
