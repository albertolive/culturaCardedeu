// pages/publica.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Publica from './publica'; // The component to test
import { slug, getFormattedDate } from '@utils/helpers'; // To be mocked

// --- Mocks ---

// Mock environment variables
const mockCreateEventUrl = 'http://localhost/api/createEvent';
process.env.NEXT_PUBLIC_CREATE_EVENT = mockCreateEventUrl;
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME = 'test-cloud';
process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET = 'test-preset';


// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    query: {},
  })),
}));

// Mock UI Components
jest.mock('@components/ui/common/form', () => ({
  Input: jest.fn(({ title, value, onChange, id }) => (
    <input
      aria-label={title || id}
      data-testid={id || title}
      value={value}
      onChange={(e) => onChange({ target: { name: id, value: e.target.value } })}
    />
  )),
  TextArea: jest.fn(({ value, onChange, id }) => (
    <textarea
      aria-label={id}
      data-testid={id}
      value={value}
      onChange={(e) => onChange({ target: { name: id, value: e.target.value } })}
    />
  )),
  Select: jest.fn(({ title, value, onChange, id }) => (
    <select
      aria-label={title || id}
      data-testid={id || title}
      value={value}
      onChange={(e) => onChange({ value: e.target.value })} // Assuming {value: ...} structure for react-select mock
    >
      <option value="">Select...</option>
      <option value="Test Location">Test Location</option>
    </select>
  )),
  DatePicker: jest.fn(({ initialStartDate, initialEndDate, onChange }) => {
    // Simplified DatePicker mock
    const handleDateChange = (name, dateStr) => {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) throw new Error("Invalid date");
            onChange(name, date);
        } catch (e) {
             // Allow invalid date for testing, form validation should catch it
            onChange(name, null);
        }
    };
    return (
      <>
        <input
          aria-label="startDate"
          data-testid="startDate"
          type="date"
          value={initialStartDate ? initialStartDate.toISOString().split('T')[0] : ''}
          onChange={(e) => handleDateChange("startDate", e.target.value)}
        />
        <input
          aria-label="endDate"
          data-testid="endDate"
          type="date"
          value={initialEndDate ? initialEndDate.toISOString().split('T')[0] : ''}
          onChange={(e) => handleDateChange("endDate", e.target.value)}
        />
      </>
    );
  }),
  ImageUpload: jest.fn(({ onUpload }) => (
    <input type="file" data-testid="imageUpload" onChange={(e) => onUpload(e.target.files[0])} />
  )),
}));


// Mock Notification component
const MockNotification = jest.fn(({ title, message, actions, customNotification, type }) => (
  <div data-testid={`notification-${type}`} role="alert">
    <h2>{title}</h2>
    <div>{typeof message === 'string' ? message : message}</div>
    {customNotification && actions && <div>{actions}</div>}
  </div>
));
jest.mock('@components/ui/common/notification', () => MockNotification);


// Mock utility functions
jest.mock('@utils/helpers', () => ({
  slug: jest.fn((text, date, id) => `${text}-${date}-${id}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
  getFormattedDate: jest.fn((startDate, endDate) => ({
    formattedStart: startDate ? new Date(startDate).toISOString().split('T')[0] : 'test-start-date',
    formattedEnd: endDate ? new Date(endDate).toISOString().split('T')[0] : 'test-end-date',
  })),
}));

// Mock global fetch
global.fetch = jest.fn();

// Helper to fill the form
const fillForm = async (user) => {
  // Click "Omet Anàlisi i Emplena Manualment" to make form visible
  const skipAnalysisButton = screen.getByText("Omet Anàlisi i Emplena Manualment");
  await user.click(skipAnalysisButton);
  
  await waitFor(() => {
    expect(screen.getByTestId('title')).toBeInTheDocument();
  });

  await user.type(screen.getByTestId('title'), 'Valid Test Event Title');
  await user.type(screen.getByTestId('description'), 'This is a valid description with more than fifteen characters.');
  await user.selectOptions(screen.getByTestId('location'), 'Test Location');
  
  // For DatePicker mock, directly interact with the input elements
  const startDateInput = screen.getByTestId('startDate');
  const endDateInput = screen.getByTestId('endDate');
  
  await user.type(startDateInput, '2024-08-01'); // YYYY-MM-DD
  await user.type(endDateInput, '2024-08-02');
  
  // Ensure dates are processed by the mocked DatePicker's onChange
  // This might require waiting for state updates if your mock behaves asynchronously
  // For this simplified mock, direct input should be sufficient before submission
};


describe('Publica Page - Event Duplication Check', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    fetch.mockClear();
    MockNotification.mockClear();
    slug.mockClear();
    getFormattedDate.mockClear();
    // Reset router mock calls if needed for specific tests
    const { useRouter } = require('next/router');
    useRouter().push.mockClear();

    // Mock localStorage for AI usage limit
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ date: new Date().toISOString().split('T')[0], count: 0 }));
    Storage.prototype.setItem = jest.fn();
  });

  // Test Case 1: No similar event found
  it('should submit the form directly if no similar event is found', async () => {
    fetch
      .mockResolvedValueOnce({ // For /api/checkExistingEvent
        ok: true,
        json: async () => null,
      })
      .mockResolvedValueOnce({ // For NEXT_PUBLIC_CREATE_EVENT
        ok: true,
        json: async () => ({ id: 'newEvent123' }),
      });

    render(<Publica />);
    await fillForm(user);

    const publicaButton = screen.getByText('Publica');
    await user.click(publicaButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/checkExistingEvent'), expect.any(Object));
    });

    await waitFor(() => {
      expect(MockNotification).not.toHaveBeenCalledWith(expect.objectContaining({ title: "Esdeveniment Similar Trobat" }));
    });
    
    await waitFor(() => {
       expect(fetch).toHaveBeenCalledWith(mockCreateEventUrl, expect.any(Object));
    });
    
    // Check for navigation (assuming no image upload for simplicity here)
    await waitFor(() => {
        const { useRouter } = require('next/router');
        expect(useRouter().push).toHaveBeenCalledWith({
          pathname: "/valid-test-event-title-2024-08-01-newevent123",
          query: { newEvent: true },
        });
    });
  });

  // Test Case 2: Similar event found, user proceeds
  it('should show warning, then proceed when "Descarta i Continua" is clicked', async () => {
    const mockExistingEvent = {
      id: 'existing123',
      summary: 'Similar Existing Event',
      start: { dateTime: '2024-08-10T10:00:00Z' },
      end: { dateTime: '2024-08-10T12:00:00Z' },
    };

    fetch
      .mockResolvedValueOnce({ // For /api/checkExistingEvent
        ok: true,
        json: async () => mockExistingEvent,
      })
      .mockResolvedValueOnce({ // For NEXT_PUBLIC_CREATE_EVENT (after user proceeds)
        ok: true,
        json: async () => ({ id: 'newEvent456' }),
      });

    getFormattedDate.mockImplementation((startDate) => ({ // Specific mock for this test
        formattedStart: new Date(startDate).toISOString().split('T')[0],
    }));
    slug.mockImplementation((summary, date, id) => `${summary}-${date}-${id}`.toLowerCase().replace(/\s+/g, '-'));


    render(<Publica />);
    await fillForm(user);
    
    const publicaButton = screen.getByText('Publica');
    await user.click(publicaButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/checkExistingEvent'), expect.any(Object));
    });
    
    let notificationTitle;
    await waitFor(() => {
        notificationTitle = screen.getByText("Esdeveniment Similar Trobat");
        expect(notificationTitle).toBeInTheDocument();
        expect(MockNotification).toHaveBeenCalledWith(
            expect.objectContaining({ title: "Esdeveniment Similar Trobat" }),
            expect.anything()
        );
        // Check for the existing event's title in the message
        expect(screen.getByText(mockExistingEvent.summary, { exact: false })).toBeInTheDocument();
    });

    // Simulate clicking "Descarta i Continua"
    // The button text is part of the 'actions' prop passed to MockNotification
    // We need to find it within the rendered output of MockNotification
    const continueButton = screen.getByText('Descarta i Continua');
    await user.click(continueButton);
    
    await waitFor(() => {
        expect(screen.queryByText("Esdeveniment Similar Trobat")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(mockCreateEventUrl, expect.any(Object));
    });

    await waitFor(() => {
        const { useRouter } = require('next/router');
        expect(useRouter().push).toHaveBeenCalledWith({
          pathname: "/valid-test-event-title-2024-08-01-newevent456",
          query: { newEvent: true },
        });
    });
  });

  // Test Case 3: Similar event found, user cancels
  it('should show warning, then cancel when "Cancel·la" is clicked', async () => {
    const mockExistingEvent = {
      id: 'existing789',
      summary: 'Another Similar Event',
      start: { date: '2024-08-15' }, // Example with only date
    };

    fetch
      .mockResolvedValueOnce({ // For /api/checkExistingEvent
        ok: true,
        json: async () => mockExistingEvent,
      });
      // NEXT_PUBLIC_CREATE_EVENT should NOT be called

    getFormattedDate.mockImplementation((startDate) => ({
        formattedStart: new Date(startDate).toISOString().split('T')[0],
    }));
    slug.mockImplementation((summary, date, id) => `${summary}-${date}-${id}`.toLowerCase().replace(/\s+/g, '-'));

    render(<Publica />);
    await fillForm(user);

    const publicaButton = screen.getByText('Publica');
    await user.click(publicaButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/checkExistingEvent'), expect.any(Object));
    });
    
    await waitFor(() => {
        expect(screen.getByText("Esdeveniment Similar Trobat")).toBeInTheDocument();
        expect(screen.getByText(mockExistingEvent.summary, { exact: false })).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel·la');
    await user.click(cancelButton);

    await waitFor(() => {
        expect(screen.queryByText("Esdeveniment Similar Trobat")).not.toBeInTheDocument();
    });
    
    // Assert that create event fetch was NOT called
    expect(fetch).not.toHaveBeenCalledWith(mockCreateEventUrl, expect.any(Object));
    
    // Assert navigation did not happen
    const { useRouter } = require('next/router');
    expect(useRouter().push).not.toHaveBeenCalled();
  });
});
