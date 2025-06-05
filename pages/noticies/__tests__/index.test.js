// Definition of isWeekendSummary (copied from pages/noticies/index.js)
function isWeekendSummary(newsItem) {
  // Check if title contains explicit weekend indicators
  if (newsItem.title && newsItem.title.toLowerCase().includes("cap de setmana")) {
    return true;
  }

  // Fallback: check start day and duration
  if (newsItem.startDate && newsItem.start?.dateTime && newsItem.end?.dateTime) {
    try {
      const eventStartDate = new Date(newsItem.startDate);
      const apiStartDate = new Date(newsItem.start.dateTime);
      const apiEndDate = new Date(newsItem.end.dateTime);

      // Check if dates are valid
      if (isNaN(eventStartDate.getTime()) || isNaN(apiStartDate.getTime()) || isNaN(apiEndDate.getTime())) {
        console.error("Error processing dates in isWeekendSummary: Invalid date provided");
        return false;
      }

      const startDayOfWeek = eventStartDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      const durationMs = apiEndDate.getTime() - apiStartDate.getTime();
      const daysDiff = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

      if ((startDayOfWeek === 5 || startDayOfWeek === 6 || startDayOfWeek === 0) && daysDiff >= 1 && daysDiff <= 4) {
        return true;
      }
    } catch (e) {
      console.error("Error processing dates in isWeekendSummary:", e);
    }
  }

  return false;
}

describe('isWeekendSummary', () => {
  // Test Case 1: Explicit "cap de setmana" in title
  it('should return true if title contains "cap de setmana"', () => {
    const newsItem = { title: "Gran cap de setmana festiu", startDate: "2023-10-20T10:00:00Z", start: { dateTime: "2023-10-20T10:00:00Z" }, end: { dateTime: "2023-10-22T22:00:00Z" } };
    expect(isWeekendSummary(newsItem)).toBe(true);
  });

  // Test Case 2: Event starting Friday, duration 3 days
  it('should return true for an event starting Friday with 3 days duration', () => {
    const newsItem = { title: "Event de divendres a diumenge", startDate: "2025-06-06T02:00:00+02:00", start: { dateTime: "2025-06-06T02:00:00+02:00" }, end: { dateTime: "2025-06-09T01:59:59+02:00" } };
    expect(isWeekendSummary(newsItem)).toBe(true);
  });

  // Test Case 3: Event starting Saturday, duration 2 days (Sat, Sun)
  it('should return true for an event starting Saturday with 2 days duration', () => {
    const newsItem = { title: "Activitat de dissabte i diumenge", startDate: "2025-06-07T10:00:00+02:00", start: { dateTime: "2025-06-07T10:00:00+02:00" }, end: { dateTime: "2025-06-09T01:59:59+02:00" } };
    expect(isWeekendSummary(newsItem)).toBe(true);
  });

  // Test Case 4: Event starting Sunday, duration 1 day (Sun only)
  it('should return true for an event starting Sunday with 1 day duration', () => {
    const newsItem = { title: "Cursa de diumenge", startDate: "2025-06-08T08:00:00+02:00", start: { dateTime: "2025-06-08T08:00:00+02:00" }, end: { dateTime: "2025-06-08T18:00:00+02:00" } };
    expect(isWeekendSummary(newsItem)).toBe(true);
  });

  // Test Case 5: The problematic case from the issue
  it('should return true for the issue example (Fri start, 4 day effective duration)', () => {
    const newsItem = { title: "Els millors plans a Cardedeu – Del 6 al 8 de juny de 2025", startDate: "2025-06-06T02:00:00+02:00", start: { dateTime: "2025-06-06T02:00:00+02:00" }, end: { dateTime: "2025-06-10T01:59:59+02:00" } };
    expect(isWeekendSummary(newsItem)).toBe(true);
  });

  // Test Case 6: Weekday event (Tuesday, 1 day)
  it('should return false for a weekday event (Tuesday, 1 day)', () => {
    const newsItem = { title: "Conferència dimarts", startDate: "2025-06-10T10:00:00+02:00", start: { dateTime: "2025-06-10T10:00:00+02:00" }, end: { dateTime: "2025-06-10T12:00:00+02:00" } };
    expect(isWeekendSummary(newsItem)).toBe(false);
  });

  // Test Case 7: Weekday event (Wednesday-Thursday, duration 2 days)
  it('should return false for a weekday event (Wednesday-Thursday, 2 days)', () => {
    const newsItem = { title: "Taller dimecres i dijous", startDate: "2025-06-11T09:00:00+02:00", start: { dateTime: "2025-06-11T09:00:00+02:00" }, end: { dateTime: "2025-06-12T17:00:00+02:00" } };
    expect(isWeekendSummary(newsItem)).toBe(false);
  });

  // Test Case 8: Event starting Friday, but too long (5 days)
  it('should return false for an event starting Friday but lasting 5 days', () => {
    const newsItem = { title: "Festival llarg de divendres a dimarts", startDate: "2025-06-06T10:00:00+02:00", start: { dateTime: "2025-06-06T10:00:00+02:00" }, end: { dateTime: "2025-06-11T10:00:00+02:00" } };
    expect(isWeekendSummary(newsItem)).toBe(false);
  });

  // Test Case 9: Missing date fields
  it('should return false if date fields are missing', () => {
    const newsItem = { title: "Activitat sense dates" };
    expect(isWeekendSummary(newsItem)).toBe(false);
  });

  // Test Case 10: Invalid date strings
  it('should return false and log an error for invalid date strings', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const newsItem = { title: "Dates invàlides", startDate: "Not A Date", start: { dateTime: "Still Not A Date" }, end: { dateTime: "Nope" } };
    expect(isWeekendSummary(newsItem)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error processing dates in isWeekendSummary: Invalid date provided");
    consoleErrorSpy.mockRestore();
  });
});
