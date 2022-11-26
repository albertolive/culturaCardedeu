import { MONTHS } from "@utils/constants";
import { nextDay, isWeekend } from "@utils/helpers";

export const dayLightSaving = 2;

export const today = () => {
  const from = new Date();
  const until = new Date();

  until.setHours(24 + dayLightSaving);
  until.setMinutes(0);
  until.setSeconds(0);

  return { from, until };
};

export const week = () => {
  const from = new Date();
  const until = nextDay(0);

  until.setHours(24 + dayLightSaving);
  until.setMinutes(0);
  until.setSeconds(0);

  return { from, until };
};

export const weekend = () => {
  let from = nextDay(5);

  if (isWeekend()) {
    from = new Date();
  } else {
    from.setHours(6 + dayLightSaving);
    from.setMinutes(0);
    from.setSeconds(0);
  }

  const until = nextDay(0);

  until.setHours(24 + dayLightSaving);
  until.setMinutes(0);
  until.setSeconds(0);

  return { from, until };
};

export const twoWeeksDefault = () => {
  const now = new Date();
  const from = new Date();
  const until = new Date(now.setDate(now.getDate() + 15));

  return { from, until };
};

export const getHistoricDates = (month, year) => {
  const getMonth = MONTHS.indexOf(
    month.charAt(0).toUpperCase() + month.slice(1)
  );

  const from = new Date(year, getMonth, 1, 2, 0, 0);
  const until = new Date(year, getMonth + 1, 0, 24, 59, 59);

  return { from, until };
};

export const getAllYears = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  let getYearsPassed = 0;

  if (currentMonth === 11) {
    const startingYear = new Date("2021", "08", "01");
    getYearsPassed = currentYear - startingYear.getFullYear();
  }

  return Array.from(
    { length: (currentYear - (getYearsPassed + 1) - currentYear) / -1 + 1 },
    (_, i) => currentYear + getYearsPassed + i * -1
  );
};
