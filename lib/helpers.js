import * as Sentry from "@sentry/nextjs";
import {
  normalizeEvent,
  normalizeEvents,
  normalizePrograms,
  normalizeAds,
} from "@utils/normalize";
import {
  getFormattedDate,
} from "@utils/helpers";

function insertItemsRandomlyWithMinDistance(array, newItems, minDistance = 3) {
  const newArray = [...array];
  // Shuffle the new items
  newItems.sort(() => Math.random() - 0.5);

  // Insert the new items into the array at random positions
  newItems.forEach(item => {
    let randomIndex;
    let isValidIndex = false;

    // Find a valid random index
    while (!isValidIndex) {
      randomIndex = Math.floor(Math.random() * (array.length + 1));

      // Check if the new item would be too close to any other new item
      isValidIndex = array.slice(Math.max(0, randomIndex - minDistance), randomIndex + minDistance).every(
        element => !newItems.includes(element)
      );
    }


    newArray.splice(randomIndex, 0, item);
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

const fetchWeather = async () => {
  return await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=cardedeu&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP}&units=metric&lang=ca`).then(response => response.json()).then(data => {
    if (!data || !data.list) {
      Sentry.captureException("Something went wrong with openweathermap", data);
      return {};
    }

    return data.list.reduce((days, row) => {
      const date = row.dt_txt;
      days[date] = [...(days[date] ? days[date] : []), row];
      return days;
    }, {});
  });
}

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

const normalizeItems = (item, weather, normalizeRss) =>
  normalizeRss ? normalizeEvent(item, weather) : normalizeEvents(item, weather);

export async function getCalendarEvent(eventId) {
  if (!eventId) return { event: [] };

  const normalizedEventId = eventId.split(/[-]+/).pop();
  const url = `https://www.googleapis.com/calendar/v3/calendars/8e1jse11ireht56ho13r6a470s@group.calendar.google.com/events/${normalizedEventId}?key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}`;
  const res = await fetch(url);
  const json = await res.json();

  const { isLessThanFiveDays } = getFormattedDate(json.start)

  const weather = isLessThanFiveDays ? await fetchWeather() : {};

  const normalizedEvent = normalizeEvent(json, weather);

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
  const url = `https://www.googleapis.com/calendar/v3/calendars/8e1jse11ireht56ho13r6a470s@group.calendar.google.com/events?timeMin=${fromDate}${untilDate}${query}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR}`;

  const res = await fetch(url);
  const json = await res.json();

  const weather = await fetchWeather();

  let normalizedEvents;
  let items = json?.items?.filter(i => !i.summary.includes("Ad"));

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

    const ads = Array.from({ length: normalizedEvents.length / 4 }, (_, i) => ({ ...adEvent, id: i }));

    normalizedEvents = insertItemsRandomlyWithMinDistance(normalizedEvents, ads)
  }

  return {
    events: normalizedEvents,
    noEventsFound: normalizedEvents.length === 0,
  };
}

async function getAccessToken() {
  const res = await fetch("https://connect.tradedoubler.com/uaa/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${process.env.NEXT_PUBLIC_TRADEDOUBLER}`,
    },
    body: `grant_type=password&username=culturacardedeu&password=${process.env.NEXT_PUBLIC_TRADEDOUBLER_PASS}`,
  });
  const json = await res.json();

  return json?.access_token;
}

async function getPrograms(accessToken) {
  const res = await fetch(
    "https://connect.tradedoubler.com/publisher/programs?sourceId=3299008&statusId=3",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const json = await res.json();

  const programs = json.items.map((ad) => normalizePrograms(ad));
  console.log(programs);
  // return programs[Math.floor(Math.random() * programs.length)];
  return programs;
}

export async function getAds({ id, adSize }) {
  const accessToken = await getAccessToken();
  // const programs = await getPrograms(accessToken);
  // const { id } = await getPrograms(accessToken);

  // if (!id) return { ad: {} };

  // const id = 229716;
  // const adSize = "300x250";

  const url = `https://connect.tradedoubler.com/publisher/ads?sourceId=3299008&programId=${id}&adType=4&adSize=${adSize}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await res.json();

  const ads = json.items.map((ad) => ({ adId: ad.adId, adSize: ad.adSize }));
  console.log("ads", ads);
  return ads[Math.floor(Math.random() * ads.length)];
}
