import { getCalendarEvents } from "@lib/helpers";

export default async function handler(req, res) {
  const now = new Date();
  const from = now;
  const until = new Date(now.getFullYear(), now.getMonth() + 1);

  try {
    res.status(200).json(await getCalendarEvents(from, until));
  } catch (error) {
    console.error(error);
  }
}
