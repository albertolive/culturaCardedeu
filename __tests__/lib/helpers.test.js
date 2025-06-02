// __tests__/lib/helpers.test.js
// Assume this file might already exist and have other tests.
// We're adding tests for getNewsSummaries.

import { getNewsSummaries } from '../../lib/helpers'; // Adjust path
import { normalizeEvent } from '../../utils/normalize'; // Adjust path
import * as Sentry from '@sentry/nextjs';

// Mock fetch globally
global.fetch = jest.fn();

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));


// Mock normalizeEvent as its implementation is not part of this specific unit test
jest.mock('../../utils/normalize', () => ({
  normalizeEvent: jest.fn(item => ({ ...item, normalized: true })),
}));

describe('getNewsSummaries', () => {
  beforeEach(() => {
    fetch.mockClear();
    normalizeEvent.mockClear();
    Sentry.captureException.mockClear();
    Sentry.captureMessage.mockClear();
    // Set up default environment variables that might be needed by the function
    process.env.NEXT_PUBLIC_NEWS_CALENDAR_ID = 'test_news_calendar_id';
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR = 'test_api_key';
  });

  it('should fetch and normalize news summaries correctly', async () => {
    const mockCalendarItems = [{ id: '1', summary: 'Raw News 1' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: mockCalendarItems }),
    });

    const result = await getNewsSummaries({ maxResults: 1 });

    expect(fetch).toHaveBeenCalledTimes(1);
    const expectedUrl = `https://www.googleapis.com/calendar/v3/calendars/test_news_calendar_id/events?key=test_api_key&timeMin=${expect.any(String)}&singleEvents=true&orderBy=startTime&maxResults=1&showDeleted=false`;
    expect(fetch).toHaveBeenCalledWith(expectedUrl);

    expect(normalizeEvent).toHaveBeenCalledWith(mockCalendarItems[0]);
    expect(result.newsSummaries).toEqual([{ id: '1', summary: 'Raw News 1', normalized: true }]);
    expect(result.noEventsFound).toBe(false);
  });

  it('should return noEventsFound if API returns no items', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    });

    const result = await getNewsSummaries();

    expect(result.newsSummaries).toEqual([]);
    expect(result.noEventsFound).toBe(true);
  });

  it('should return noEventsFound if API returns no items property', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // No 'items' property
    });

    const result = await getNewsSummaries();
    expect(result.newsSummaries).toEqual([]);
    expect(result.noEventsFound).toBe(true);
  });

  it('should handle API fetch error gracefully and capture to Sentry', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });

    const result = await getNewsSummaries();

    expect(result.newsSummaries).toEqual([]);
    expect(result.noEventsFound).toBe(true);
    expect(Sentry.captureMessage).toHaveBeenCalledWith(expect.stringContaining('Error fetching news summaries: Internal Server Error'));
  });

  it('should handle exception during fetch and capture to Sentry', async () => {
    fetch.mockRejectedValueOnce(new Error('Network failure'));

    const result = await getNewsSummaries();

    expect(result.newsSummaries).toEqual([]);
    expect(result.noEventsFound).toBe(true);
    expect(Sentry.captureException).toHaveBeenCalledWith(new Error('Network failure'));
  });

   it('should use default NEWS_CALENDAR_ID if env var is not set', async () => {
    delete process.env.NEXT_PUBLIC_NEWS_CALENDAR_ID; // Ensure it's not set
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    });

    await getNewsSummaries();
    const expectedUrl = `https://www.googleapis.com/calendar/v3/calendars/YOUR_NEWS_CALENDAR_ID/events?key=test_api_key&timeMin=${expect.any(String)}&singleEvents=true&orderBy=startTime&maxResults=1&showDeleted=false`;
    expect(fetch).toHaveBeenCalledWith(expectedUrl); // Checks if it uses the fallback ID
  });
});
