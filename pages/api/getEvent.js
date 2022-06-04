import { getCalendarEvent } from "@lib/helpers";

export default async function handler(req, res) {
  try {
    const event = await getCalendarEvent(req.query.eventId);

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
