import {
  DAYS,
  MONTHS,
  TAGS,
  LOCATIONS,
  VITAMINED_LOCATIONS,
} from "./constants";

const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const getFormattedDate = (start, end) => {
  const startDate = new Date(start.date || start.dateTime);
  const endDate = new Date(end.date || end.dateTime);
  const numberDay = new Date(startDate).getDay();
  const numberMonth = new Date(startDate).getMonth();
  const nameDay = DAYS[numberDay];
  const nameMonth = MONTHS[numberMonth];

  const formattedStart = `${startDate.getDate()} de ${nameMonth} del ${startDate.getFullYear()}`;
  const startTime = `${startDate.getHours()}:${String(
    startDate.getMinutes()
  ).padStart(2, "0")}`;
  const endTime = `${endDate.getHours()}:${String(
    endDate.getMinutes()
  ).padStart(2, "0")}`;

  return { formattedStart, startTime, endTime, nameDay };
};

export const normalizeEvents = (event) => {
  const { formattedStart, startTime, endTime, nameDay } = getFormattedDate(
    event.start,
    event.end
  );
  const location = event.location ? event.location.split(",")[0] : "Cardedeu";
  let title = event.summary || "";
  const tag = TAGS.find((v) => title.includes(v)) || null;

  if (tag) {
    title = title.replace(`${tag}:`, "").trim();
  }

  return {
    title,
    startTime,
    endTime,
    location,
    formattedStart,
    nameDay,
    tag,
  };
};

export const normalizeEvent = (event) => {
  const { formattedStart, startTime, endTime, nameDay } = getFormattedDate(
    event.start,
    event.end
  );
  let location = event.location ? event.location.split(",")[0] : "Cardedeu";
  let title = event.summary || "";
  const tag = TAGS.find((v) => title.includes(v)) || null;

  if (tag) {
    title = title.replace(`${tag}:`, "").trim();
  }

  let locationNormalized = VITAMINED_LOCATIONS["cardedeu"];

  Object.keys(LOCATIONS).find((k) => {
    const newLocation = event.location || "Cardedeu";
    if (
      location
        .toLowerCase()
        .split(" ")
        .some((word) => LOCATIONS[k].includes(word))
    )
      locationNormalized = VITAMINED_LOCATIONS[k];
  });

  let slug = `${title
    .toLowerCase()
    .replace(/ /g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/"/g, "")
    .replace(/,/g, "")
    .replace(/:/g, "")}-${formattedStart.toLowerCase().replace(/ /g, "-")}-${
    event.id
  }`;

  return {
    title,
    description: DOMPurify.sanitize(event.description) || "",
    id: event.id,
    location,
    formattedStart,
    nameDay,
    startTime,
    endTime,
    tag,
    slug,
    ...locationNormalized,
  };
};
