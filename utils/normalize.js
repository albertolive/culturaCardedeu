import { TAGS } from "./constants";
import {
  slug,
  getFormattedDate,
  getVitaminedLocation,
  sanitizeText,
} from "./helpers";

export const normalizeEvents = (event) => {
  const {
    originalFormattedStart,
    formattedStart,
    formattedEnd,
    startTime,
    endTime,
    nameDay,
  } = getFormattedDate(event.start, event.end);
  const regex = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/g;
  const hasEventImage = event.description && event.description.match(regex);
  const eventImage = hasEventImage && hasEventImage[0]
  const location = event.location ? event.location.split(",")[0] : "Cardedeu";
  let title = event.summary ? sanitizeText(event.summary) : "";
  const tag = TAGS.find((v) => title.includes(v)) || null;

  if (tag) title = title.replace(`${tag}:`, "").trim();

  const locationNormalized = getVitaminedLocation(location);
  const imageUploaded = event.guestsCanModify || false;
  const imageId = event.id ? event.id.split("_")[0] : event.id;

  return {
    id: event.id,
    title,
    startTime,
    endTime,
    location,
    formattedStart,
    formattedEnd,
    nameDay,
    tag,
    slug: slug(title, originalFormattedStart, event.id),
    ...locationNormalized,
    startDate: event.start && event.start.dateTime,
    endDate: event.end && event.end.dateTime,
    imageUploaded: imageUploaded
      ? `https://res.cloudinary.com/culturaCardedeu/image/upload/c_fill/c_scale,w_auto,q_auto,f_auto/v1/culturaCardedeu/${imageId}`
      : eventImage
      ? eventImage
      : null
      ,
    description: event.description
      ? event.description
      : "Cap descripció. Vols afegir-ne una? Escriu-nos i et direm com fer-ho!",
  };
};

export const normalizeEvent = (event) => {
  if (!event || event.error) return null;

  const {
    originalFormattedStart,
    formattedStart,
    formattedEnd,
    startTime,
    endTime,
    nameDay,
  } = getFormattedDate(event.start, event.end);
  let location = event.location ? event.location.split(",")[0] : "Cardedeu";
  let title = event.summary ? sanitizeText(event.summary) : "";
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
    formattedEnd,
    nameDay,
    description: event.description
      ? event.description
      : "Cap descripció. Vols afegir-ne una? Escriu-nos i et direm com fer-ho!",
    tag,
    slug: slug(title, originalFormattedStart, event.id),
    ...locationNormalized,
    startDate: event.start && event.start.dateTime,
    endDate: event.end && event.end.dateTime,
    imageUploaded: imageUploaded
      ? `https://res.cloudinary.com/culturaCardedeu/image/upload/c_fill/c_scale,w_auto,q_auto,f_auto/v1/culturaCardedeu/${imageId}`
      : null,
    imageId,
    isEventFinished: event.end
      ? new Date(event.end.dateTime) < new Date()
      : false,
  };
};

export const normalizePrograms = ({ id }) => ({
  id,
});

export const normalizeAds = ({
  adId,
  // programId,
  // programName,
  adSize,
  // url,
  // productUrl,
}) => {
  return {
    adId,
    // programId,
    // programName,
    adSize,
    // url,
    // productUrl,
  };
};
