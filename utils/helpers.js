import { DAYS, MONTHS } from "./constants";

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

export const getFormattedDate = (start, end) => {
  const startDate = new Date(start.date || start.dateTime || start);
  const endDate = new Date(end.date || end.dateTime || end);
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
