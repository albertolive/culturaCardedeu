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
