import { getCalendarEvents } from "@lib/helpers";

export default async function handler(req, res) {
  const now = new Date();
  const from = new Date();
  const until = new Date(now.setDate(now.getDate() + 15));
  const events = await getCalendarEvents(from, until);

  try {
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
  }
}
