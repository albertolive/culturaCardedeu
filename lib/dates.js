import { MONTHS_URL as MONTHS } from "@utils/constants";

const getMadridParts = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const parts = formatter.formatToParts(date);
  const partVal = (type) => parts.find((p) => p.type === type)?.value;
  return {
    year: parseInt(partVal("year"), 10),
    month: parseInt(partVal("month"), 10) - 1, // 0-indexed
    day: parseInt(partVal("day"), 10),
    hour: parseInt(partVal("hour"), 10),
    minute: parseInt(partVal("minute"), 10),
    second: parseInt(partVal("second"), 10),
  };
};

const getMadridWeekday = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    weekday: "short",
  });
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return WEEKDAYS.indexOf(formatter.format(date));
};

const getMadridDate = (year, month, day, hour = 0, minute = 0, second = 0) => {
  const guessUtc = Date.UTC(year, month, day, hour, minute, second);
  const date = new Date(guessUtc);
  
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  
  const parts = formatter.formatToParts(date);
  const partVal = (type) => parseInt(parts.find((p) => p.type === type).value, 10);
  
  const y = partVal("year");
  const m = partVal("month") - 1;
  const d = partVal("day");
  let h = partVal("hour");
  if (h === 24) h = 0;
  const min = partVal("minute");
  const sec = partVal("second");
  
  const localUtc = Date.UTC(y, m, d, h, min, sec);
  const offset = localUtc - guessUtc;
  
  return new Date(guessUtc - offset);
};

export const today = () => {
  const from = new Date();
  const madridParts = getMadridParts(from);
  const until = getMadridDate(madridParts.year, madridParts.month, madridParts.day + 1, 0, 0, 0);

  return { from, until };
};

export const week = () => {
  const from = new Date();
  const madridParts = getMadridParts(from);
  const currentWeekday = getMadridWeekday(from);
  const daysToMonday = currentWeekday === 0 ? 1 : 8 - currentWeekday;
  const until = getMadridDate(madridParts.year, madridParts.month, madridParts.day + daysToMonday, 0, 0, 0);

  return { from, until };
};

export const weekend = () => {
  const fromDate = new Date();
  const currentWeekday = getMadridWeekday(fromDate);
  const madridParts = getMadridParts(fromDate);

  let from;
  const isWeekendMadrid = currentWeekday === 0 || currentWeekday === 5 || currentWeekday === 6;
  if (isWeekendMadrid) {
    from = fromDate;
  } else {
    const daysToFriday = (5 - currentWeekday + 7) % 7;
    from = getMadridDate(madridParts.year, madridParts.month, madridParts.day + daysToFriday, 6, 0, 0);
  }

  const daysToMonday = currentWeekday === 0 ? 1 : 8 - currentWeekday;
  const until = getMadridDate(madridParts.year, madridParts.month, madridParts.day + daysToMonday, 0, 0, 0);

  return { from, until };
};

export const twoWeeksDefault = () => {
  const from = new Date();
  const until = new Date(from.getTime() + 15 * 24 * 60 * 60 * 1000);

  return { from, until };
};

export const getHistoricDates = (month, year) => {
  const getMonth = MONTHS.indexOf(month);

  const from = getMadridDate(year, getMonth, 1, 0, 0, 0);
  
  // Last day of this month
  const lastDayDate = new Date(year, getMonth + 1, 0);
  const until = getMadridDate(year, getMonth, lastDayDate.getDate(), 23, 59, 59);

  return { from, until };
};

export const getAllYears = () => {
  const todayDate = new Date();
  const currentYear = todayDate.getFullYear();
  const startingYear = new Date("2021", "08", "01");
  const getYearsPassed = currentYear - startingYear.getFullYear();

  return Array.from(
    { length: (currentYear - getYearsPassed - currentYear) / -1 + 1 },
    (_, i) => currentYear + i * -1
  );
};
