import { getCalendarEvents } from "@lib/helpers";

export default async function handler(req, res) {
  const now = new Date();
  const from = now;
  const until = new Date(now.getFullYear(), now.getMonth() + 2);
  const events = await getCalendarEvents(from, until);

  try {
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
  }
}
