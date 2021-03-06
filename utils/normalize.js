import { TAGS } from "./constants";
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
    startDate: event.start && event.start.dateTime,
    endDate: event.end && event.end.dateTime,
    description: event.description
      ? event.description
      : "Cap descripciĆ³. Vols afegir-ne una? Escriu-nos i et direm com fer-ho!",
  };
};

export const normalizeEvent = (event) => {
  if (!event || event.error) return null;

  const { formattedStart, startTime, endTime, nameDay } = getFormattedDate(
    event.start,
    event.end
  );
  let location = event.location ? event.location.split(",")[0] : "Cardedeu";
  let title = event.summary || "";
  const tag = TAGS.find((v) => title.includes(v)) || null;

  if (tag) title = title.replace(`${tag}:`, "").trim();

  const imageUploaded = event.guestsCanModify || false;
  const imageId = event.id ? event.id.split("_")[0] : event.id;

  const locationNormalized = getVitaminedLocation(location);

  return {
    id: event.id,
    title,
    startTime,
    endTime,
    location,
    formattedStart,
    nameDay,
    description: event.description
      ? event.description
      : "Cap descripciĆ³. Vols afegir-ne una? Escriu-nos i et direm com fer-ho!",
    tag,
    slug: slug(title, formattedStart, event.id),
    ...locationNormalized,
    startDate: event.start && event.start.dateTime,
    endDate: event.end && event.end.dateTime,
    imageUploaded: imageUploaded
      ? `https://res.cloudinary.com/culturaCardedeu/image/upload/c_fill/c_scale,w_auto,q_auto,f_auto/v1/culturaCardedeu/${imageId}`
      : null,
    isEventFinished: event.end
      ? new Date(event.end.dateTime) < new Date()
      : false,
  };
};
