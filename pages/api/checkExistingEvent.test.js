// pages/api/checkExistingEvent.test.js
import handler from './checkExistingEvent'; // The API route handler
import { getCalendarEvents } from '../../lib/helpers'; // The function to mock

// Mock the getCalendarEvents function
jest.mock('../../lib/helpers', () => ({
  getCalendarEvents: jest.fn(),
}));

// Helper to create mock req and res objects
const mockReqRes = (method, query, body = null) => {
  const req = { method, query, body };
  const res = {
    statusCode: null,
    body: null,
    setHeader: jest.fn(),
    status: jest.fn((code) => {
      res.statusCode = code;
      return {
        json: jest.fn((jsonBody) => {
          res.body = jsonBody;
        }),
      };
    }),
    json: jest.fn((jsonBody) => { // Fallback for res.json if status is not chained
        res.body = jsonBody;
    })
  };
  return { req, res };
};

describe('API Route: /api/checkExistingEvent', () => {
  beforeEach(() => {
    // Reset mocks before each test
    getCalendarEvents.mockClear();
  });

  it('should return the first event if getCalendarEvents finds events', async () => {
    const mockEvents = [{ id: '1', summary: 'Event 1' }, { id: '2', summary: 'Event 2' }];
    getCalendarEvents.mockResolvedValue(mockEvents);

    const startDate = new Date().toISOString();
    const title = 'Test Event';
    const { req, res } = mockReqRes('GET', { title, startDate });

    await handler(req, res);

    expect(getCalendarEvents).toHaveBeenCalledWith({ from: new Date(startDate), q: title });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockEvents[0]);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
  });

  it('should return null if getCalendarEvents returns an empty array', async () => {
    getCalendarEvents.mockResolvedValue([]);

    const startDate = new Date().toISOString();
    const title = 'Test Event';
    const { req, res } = mockReqRes('GET', { title, startDate });

    await handler(req, res);

    expect(getCalendarEvents).toHaveBeenCalledWith({ from: new Date(startDate), q: title });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeNull();
  });

  it('should return null if getCalendarEvents throws an error', async () => {
    getCalendarEvents.mockRejectedValue(new Error('API Error'));

    const startDate = new Date().toISOString();
    const title = 'Test Event';
    const { req, res } = mockReqRes('GET', { title, startDate });

    await handler(req, res);

    expect(getCalendarEvents).toHaveBeenCalledWith({ from: new Date(startDate), q: title });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeNull();
  });

  it('should return 400 and an error message if title is missing', async () => {
    const startDate = new Date().toISOString();
    const { req, res } = mockReqRes('GET', { startDate }); // title is missing

    await handler(req, res);

    expect(getCalendarEvents).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Missing required query parameters: title and startDate' });
  });
  
  it('should return 400 and an error message if startDate is missing', async () => {
    const title = 'Test Event';
    const { req, res } = mockReqRes('GET', { title }); // startDate is missing

    await handler(req, res);

    expect(getCalendarEvents).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Missing required query parameters: title and startDate' });
  });

  it('should return 400 and an error message if startDate is invalid', async () => {
    const title = 'Test Event';
    const invalidStartDate = 'not-a-date';
    const { req, res } = mockReqRes('GET', { title, startDate: invalidStartDate });

    await handler(req, res);

    expect(getCalendarEvents).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid startDate format. Please use a valid ISO date string.' });
  });
  
  it('should handle optional endDate and location parameters gracefully', async () => {
    const mockEvents = [{ id: '1', summary: 'Event 1' }];
    getCalendarEvents.mockResolvedValue(mockEvents);

    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + 86400000).toISOString(); // tomorrow
    const title = 'Test Event with EndDate';
    const location = 'Test Location';
    const { req, res } = mockReqRes('GET', { title, startDate, endDate, location });

    await handler(req, res);

    expect(getCalendarEvents).toHaveBeenCalledWith({ from: new Date(startDate), q: title });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockEvents[0]);
  });

});
