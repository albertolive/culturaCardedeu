import * as Sentry from "@sentry/nextjs";
import { normalizeEvent, normalizeEvents } from "@utils/normalize";

function insertItemsRandomlyWithMinDistance(array, newItems, minDistance = 3) {
  const newArray = [...array];
  // Shuffle the new items
  newItems.sort(() => Math.random() - 0.5);

  // Create an array to keep track of indexes where items have been inserted
  let insertedIndexes = [];

  // Create a list of valid indexes where new items can be inserted
  let validIndexes = Array.from({ length: array.length }, (_, i) => i).filter(
    (index) => {
      return insertedIndexes.every(
        (insertedIndex) => Math.abs(insertedIndex - index) >= minDistance
      );
    }
  );

  // Insert the new items into the array at random positions
  newItems.forEach((item) => {
    if (validIndexes.length === 0) {
      console.error("No valid positions left for inserting new items.");
      return;
    }

    // Pick a random index from the list of valid indexes
    let randomIndex = validIndexes.splice(
      Math.floor(Math.random() * validIndexes.length),
      1
    )[0];

    // Add the valid index to the insertedIndexes array
    insertedIndexes.push(randomIndex);
    newArray.splice(randomIndex, 0, item);

    // Update the list of valid indexes
    validIndexes = validIndexes.filter((index) => {
      return insertedIndexes.every(
        (insertedIndex) => Math.abs(insertedIndex - index) >= minDistance
      );
    });
  });

  return newArray;
}

async function fetchDataWithRetry(url, options = {}, retries = 3) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left.`);
      return await fetchDataWithRetry(url, options, retries - 1);
    } else {
      throw error;
    }
  }
}

const now = new Date();

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

const normalizeItems = (item, weather, normalizeRss) =>
  normalizeRss ? normalizeEvent(item) : normalizeEvents(item, weather);

export async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=cardedeu&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP}&units=metric&lang=ca`;

  return await fetch(url)
    .then(async (response) => {
      const data = await response.json();
      if (!data || !data.list) {
        console.error("Something went wrong with openweathermap, data");
        Sentry.captureException(
          "Something went wrong with openweathermap",
          data
        );
        return {};
      }

      return data.list.reduce((days, row) => {
        const date = row.dt_txt;
        days[date] = [...(days[date] ? days[date] : []), row];
        return days;
      }, {});
    })
    .catch((error) => {
      console.error("Something went wrong with openweathermap", error);
      Sentry.captureException(
        "Something went wrong with openweathermap",
        error
      );
      // Return a default value or an error object to handle the failure
      return {};
    });
}

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
  maxResults = 10,
  filterByDate = true,
}) {
  const fromDate = from.toISOString();
  const untilDate = until ? `&timeMax=${until.toISOString()}` : "";
  const query = q ? `&q=${q}` : "";
  const gcalUrl = `https://www.googleapis.com/calendar/v3/calendars/8e1jse11ireht56ho13r6a470s@group.calendar.google.com/events?timeMin=${fromDate}${untilDate}${query}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}`;

  const [gcalResponse, weather] = await Promise.all([
    fetch(gcalUrl),
    getWeather(),
  ]);

  const events = await gcalResponse.json();

  let normalizedEvents;
  let items = events?.items?.filter((i) => !i.summary.includes("Ad"));

  try {
    normalizedEvents = items
      ? filterByDate
        ? filterByDateFn(items).map((item) =>
            normalizeItems(item, weather, normalizeRss)
          )
        : items.map((item) => normalizeItems(item, weather, normalizeRss))
      : [];
  } catch (e) {
    console.error(e);
    return [];
  }

  if (normalizedEvents.length) {
    const adEvent = {
      id: 0,
      isAd: true,
      images: [],
      location: "",
      slug: "",
    };

    const ads = Array.from({ length: normalizedEvents.length / 8 }, (_, i) => ({
      ...adEvent,
      id: i,
    }));

    normalizedEvents = insertItemsRandomlyWithMinDistance(
      normalizedEvents,
      ads
    );
  }

  return {
    events: normalizedEvents,
    noEventsFound: normalizedEvents.length === 0,
  };
}
