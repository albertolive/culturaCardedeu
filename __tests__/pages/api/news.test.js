// __tests__/pages/api/news.test.js
import { createMocks } from 'node-mocks-http';
import newsHandler from '../../../pages/api/news'; // Adjust path if needed
import * as Sentry from '@sentry/nextjs';

// Mock a function from a module
jest.mock('../../../lib/helpers', () => ({
  getNewsSummaries: jest.fn(),
}));
const { getNewsSummaries } = require('../../../lib/helpers'); // require it after mocking

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  withSentry: jest.fn((handler) => handler), // Mock withSentry to just return the handler
}));


describe('/api/news', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return news summaries successfully', async () => {
    const mockNewsData = {
      newsSummaries: [{ id: '1', summary: 'Test News', description: 'Test content' }],
      noEventsFound: false,
    };
    getNewsSummaries.mockResolvedValue(mockNewsData);

    const { req, res } = createMocks({
      method: 'GET',
    });

    await newsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockNewsData);
    expect(res._getHeaders()['cache-control']).toBe('public, s-maxage=3600, stale-while-revalidate=1800');
  });

  it('should return 200 and empty data if no news summaries are found', async () => {
    getNewsSummaries.mockResolvedValue({ newsSummaries: [], noEventsFound: true });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await newsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ newsSummaries: [], noEventsFound: true });
  });

  it('should return 500 if getNewsSummaries throws an error', async () => {
    getNewsSummaries.mockRejectedValue(new Error('Failed to fetch'));

    const { req, res } = createMocks({
      method: 'GET',
    });

    await newsHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Failed to fetch news summaries' });
  });
});
