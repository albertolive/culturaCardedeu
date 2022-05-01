import { DAYS, MONTHS, LOCATIONS, VITAMINED_LOCATIONS } from "./constants";

export const slug = (str, formattedStart, id) =>
  `${str
    .toLowerCase()
    .replace(/ /g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/"/g, "")
    .replace(/,/g, "")
    .replace(/\+/g, "")
    .replace(/\|/g, "")
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
