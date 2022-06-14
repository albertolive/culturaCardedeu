import { DAYS, MONTHS, LOCATIONS, VITAMINED_LOCATIONS } from "./constants";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

export const slug = (str, formattedStart, id) =>
  `${str
    .toLowerCase()
    .replace(/ /g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/"/g, "")
    .replace(/,/g, "")
    .replace(/’/g, "'")
    .replace(".", "")
    .replace("%", "")
    .replace(/\+/g, "")
    .replace(/\|/g, "")
    .replace(/•|/g, "")
    .replace(/ª|/g, "a")
    .replace(/:/g, "")}-${formattedStart
    .toLowerCase()
    .replace(/ /g, "-")}-${id}`;

export const convertTZ = (date, tzString) =>
  new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );

export const getFormattedDate = (start, end) => {
  const startDate = new Date(
    (start && start.date) || (start && start.dateTime) || start
  );
  const endDate = new Date((end && end.date) || (end && end.dateTime) || end);

  const startDateConverted = convertTZ(startDate, "Europe/Madrid");
  const endDateConverted = convertTZ(endDate, "Europe/Madrid");

  const numberDay = new Date(startDateConverted).getDay();
  const numberMonth = new Date(startDateConverted).getMonth();
  const nameDay = DAYS[numberDay];
  const nameMonth = MONTHS[numberMonth];

  const formattedStart = `${startDateConverted.getDate()} de ${nameMonth} del ${startDateConverted.getFullYear()}`;
  const startTime = `${startDateConverted.getHours()}:${String(
    startDateConverted.getMinutes()
  ).padStart(2, "0")}`;
  const endTime = `${endDateConverted.getHours()}:${String(
    endDateConverted.getMinutes()
  ).padStart(2, "0")}`;

  return { formattedStart, startTime, endTime, nameDay };
};

export const getVitaminedLocation = (location) => {
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

  return locationNormalized;
};

export const nextDay = (x) => {
  let now = new Date();
  now.setDate(now.getDate() + ((x + (7 - now.getDay())) % 7));
  const covertDate = convertTZ(now, "Europe/Madrid");

  return covertDate;
};

export const isWeekend = () => {
  const now = new Date();

  return now.getDay() === 0 || now.getDay() === 5 || now.getDay() === 6;
};

export const monthsName = [
  "Gener",
  "Febrer",
  "Març",
  "Abril",
  "Maig",
  "Juny",
  "Juliol",
  "Agost",
  "Septembre",
  "Octubre",
  "Novembre",
  "Desembre",
];

const transformImagestoAbsoluteUrl = (images) =>
  images.map((image) => `${siteUrl}${image}`);

export const generateJsonData = ({
  title,
  slug,
  description,
  startDate,
  endDate,
  location,
  lat,
  lng,
  uploadedImage,
  images,
  social,
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: title,
  url: `${siteUrl}/${slug}`,
  startDate,
  endDate,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: location,
    address: {
      "@type": "PostalAddress",
      streetAddress: location,
      addressLocality: "Cardedeu",
      postalCode: "08440",
      addressCountry: "ES",
      addressRegion: "CT",
    },
    geo: {
      latitude: lat,
      "@type": "GeoCoordinates",
      longitude: lng,
    },
  },
  image: [uploadedImage, ...transformImagestoAbsoluteUrl(images)].filter(
    Boolean
  ),
  description,
  performer: {
    "@type": "PerformingGroup",
    name: location,
  },
  organizer: {
    "@type": "Organization",
    name: location,
    url: social ? social.web : siteUrl,
  },
  offers: {
    "@type": "Offer",
    price: 0,
    isAccessibleForFree: true,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${siteUrl}/${slug}`,
    validFrom: startDate,
  },
});
