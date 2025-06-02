// pages/api/news.js
import { withSentry } from "@sentry/nextjs";
import { getNewsSummaries } from "../../lib/helpers"; // Path to helpers.js

async function handler(req, res) {
  try {
    // Fetch the latest news summary. Adjust maxResults if needed.
    const { newsSummaries, noEventsFound } = await getNewsSummaries({ maxResults: 1 });

    if (noEventsFound) {
      // You can decide whether to return 404 or an empty array with 200
      // For a "news" page, an empty result might be acceptable.
      // If a summary is strictly expected, a 404 might be more appropriate.
      // Let's go with 200 and an empty array for now.
      res.status(200).json({ newsSummaries: [], noEventsFound: true });
      return;
    }

    // Cache for 1 hour. Adjust as summaries are generated weekly.
    // Once a new summary is generated, this cache should ideally be invalidated,
    // or a shorter TTL used around the time of generation.
    // For simplicity, a fixed TTL is used here.
    // Vercel recommends: 'public, s-maxage=X, stale-while-revalidate=Y'
    // s-maxage for CDN cache, max-age for browser cache (if not using s-maxage)
    // For weekly news, could be s-maxage=604800 (1 week), stale-while-revalidate=3600 (1 hour)
    // Let's use a more conservative 1-hour CDN cache for now.
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ newsSummaries, noEventsFound: false });
  } catch (error) {
    console.error('Error in /api/news:', error);
    // Sentry will capture this via withSentry wrapper
    res.status(500).json({ error: "Failed to fetch news summaries" });
  }
}

export default withSentry(handler);
