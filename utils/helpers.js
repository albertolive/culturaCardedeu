import { DAYS, MONTHS, LOCATIONS, VITAMINED_LOCATIONS } from "./constants";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

export const sanitize = (str) =>
  str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace("–", "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/"/g, "")
    .replace(/,/g, "")
    .replace(/’/g, "")
    .replace(/'/g, "")
    .replace(".", "")
    .replace("(", "")
    .replace(")", "")
    .replace("%", "")
    .replace("&", "")
    .replace("?", "")
    .replace("¿", "")
    .replace(/“/g, "")
    .replace(/”/g, "")
    .replace("…", "")
    .replace("ª", "a")
    .replace("/", "-")
    .replace(/\+/g, "")
    .replace(/\|/g, "")
    .replace(/•|/g, "")
    .replace(/·|/g, "")
    .replace(/º|/g, "")
    .replace(/:/g, "")
    .replace(/\[Ad\]/g, "")
    .replace(/(<([^>]+)>)/gi, "");

export const sanitizeText = (str) => str.replace("&amp;", "&").replace(/\[Ad\]/g, "");

export const slug = (str, formattedStart, id) =>
  `${sanitize(str)}-${formattedStart
    .toLowerCase()
    .replace(/ /g, "-")
    .replace("---", "-")
    .replace("ç", "c")
    .replace(/--/g, "-")}-${id}`;

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

  let isMultipleDays = false;
  let isSameMonth = false;
  let isSameYear = false;
  const startDay = startDateConverted.getDate()
  const endDay = endDateConverted.getDate()

  if (startDay !== endDay)
    isMultipleDays = true;

  if (startDateConverted.getMonth() === endDateConverted.getMonth())
    isSameMonth = true;

  if (startDateConverted.getFullYear() === endDateConverted.getFullYear())
    isSameYear = true;

  const weekDay = new Date(startDateConverted).getDay();
  const month = new Date(startDateConverted).getMonth();
  const year = new Date(startDateConverted).getFullYear();
  const nameDay = DAYS[weekDay];
  const nameMonth = MONTHS[month];

  const originalFormattedStart = `${startDay} de ${nameMonth} del ${year}`;
  const formattedStart =
    isMultipleDays && isSameMonth
      ? `${startDay}`
      : `${startDay} de ${nameMonth} ${isMultipleDays && isSameYear ? "" : `del ${year}`
      }`;
  const formattedEnd = `${endDay} de ${MONTHS[endDateConverted.getMonth()]
    } del ${endDateConverted.getFullYear()}`;
  const startTime = `${startDateConverted.getHours()}:${String(
    startDateConverted.getMinutes()
  ).padStart(2, "0")}`;
  const endTime = `${endDateConverted.getHours()}:${String(
    endDateConverted.getMinutes()
  ).padStart(2, "0")}`;

  return {
    originalFormattedStart,
    formattedStart,
    formattedEnd: isMultipleDays ? formattedEnd : null,
    startTime,
    endTime,
    nameDay,
    startDate: isMultipleDays ? startDay <= new Date().getDate() && convertTZ(new Date(), "Europe/Madrid") || startDateConverted : startDateConverted
  };
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
  "gener",
  "febrer",
  "març",
  "abril",
  "maig",
  "juny",
  "juliol",
  "agost",
  "setembre",
  "octubre",
  "novembre",
  "desembre",
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
  imageUploaded,
  images,
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
  image: [imageUploaded, ...transformImagestoAbsoluteUrl(images)].filter(
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
    url: siteUrl,
  },
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${siteUrl}/${slug}`,
    validFrom: startDate,
  },
  isAccessibleForFree: true,
});
