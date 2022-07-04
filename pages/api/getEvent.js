import { withSentry } from "@sentry/nextjs";
import { getCalendarEvent } from "@lib/helpers";

const handler = async (req, res) => {
  try {
    const event = await getCalendarEvent(req.query.eventId);

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export default withSentry(handler);
