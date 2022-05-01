import { TAGS, LOCATIONS, VITAMINED_LOCATIONS } from "./constants";
import { slug, getFormattedDate, getVitaminedLocation } from "./helpers";

export const normalizeEvents = (event) => {
  const { formattedStart, startTime, endTime, nameDay } = getFormattedDate(
    event.start,
    event.end
  );
  const location = event.location ? event.location.split(",")[0] : "Cardedeu";
  let title = event.summary || "";
  const tag = TAGS.find((v) => title.includes(v)) || null;

  if (tag) title = title.replace(`${tag}:`, "").trim();

  const locationNormalized = getVitaminedLocation(location);

  return {
    id: event.id,
    title,
    startTime,
    endTime,
    location,
    formattedStart,
    nameDay,
    tag,
    slug: slug(title, formattedStart, event.id),
    ...locationNormalized,
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

  if (tag) title = title.replace(`${tag}:`, "").trim();

  const locationNormalized = getVitaminedLocation(location);

  return {
    id: event.id,
    title,
    startTime,
    endTime,
    location,
    formattedStart,
    nameDay,
    description: event.description || "",
    tag,
    slug: slug(title, formattedStart, event.id),
    ...locationNormalized,
    startDate: event.start && event.start.dateTime,
    endDate: event.end && event.end.dateTime,
    imageUploaded: event.guestsCanModify || false,
  };
};
