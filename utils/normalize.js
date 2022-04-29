import { TAGS, LOCATIONS, VITAMINED_LOCATIONS } from "./constants";
import { slug, getFormattedDate } from "./helpers";

const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

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
  if (!event) return null;

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
    if (
      location
        .toLowerCase()
        .split(" ")
        .some((word) => LOCATIONS[k].includes(word))
    )
      locationNormalized = VITAMINED_LOCATIONS[k];
  });

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
    slug: slug(title, formattedStart, event.id),
    ...locationNormalized,
    startDate: event.start && event.start.dateTime,
    endDate: event.end && event.end.dateTime,
  };
};
