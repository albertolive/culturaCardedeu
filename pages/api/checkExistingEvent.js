// pages/api/checkExistingEvent.js
import { getCalendarEvents } from '../../lib/helpers';
import { withSentry } from '@sentry/nextjs';

const handler = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { title, startDate, endDate, location } = req.query;

    if (!title || !startDate) {
      // Title and startDate are essential for the check
      return res.status(400).json({ error: 'Missing required query parameters: title and startDate' });
    }

    let fromDate;
    try {
      fromDate = new Date(startDate);
      if (isNaN(fromDate.getTime())) {
        throw new Error('Invalid startDate format');
      }
    } catch (error) {
      console.error('Error parsing startDate:', error);
      return res.status(400).json({ error: 'Invalid startDate format. Please use a valid ISO date string.' });
    }

    try {
      const events = await getCalendarEvents({ from: fromDate, q: title });

      if (events && events.length > 0) {
        return res.status(200).json(events[0]);
      } else {
        // No events found or events array is empty
        return res.status(200).json(null);
      }
    } catch (calendarError) {
      console.error('Error calling getCalendarEvents:', calendarError);
      // Error during getCalendarEvents call
      return res.status(200).json(null);
    }
  } catch (error) {
    console.error('Error in checkExistingEvent handler:', error);
    // This catches errors from query parameter parsing or other unexpected issues
    // Return 200 with null as per requirement for errors as well
    return res.status(200).json(null);
  }
};

export default withSentry(handler);
