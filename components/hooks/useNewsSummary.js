// components/hooks/useNewsSummary.js
import useSWR, { preload } from 'swr';

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the news data.');
    // Attach extra info to the error object.
    try {
      error.info = await res.json();
    } catch (e) {
      // If res.json() fails, use text content
      error.info = await res.text();
    }
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const API_ENDPOINT = '/api/news';

// Call preload for the API endpoint before the hook definition or first use.
// This helps in starting the fetch early if this module is loaded.
preload(API_ENDPOINT, fetcher);

export const useNewsSummary = (options = {}) => {
  const swrOptions = {
    suspense: options.suspense || false,
    keepPreviousData: options.keepPreviousData || true,
    refreshInterval: options.refreshInterval || 60 * 60 * 1000, // Refresh every 1 hour
    revalidateOnFocus: options.revalidateOnFocus || true,
    revalidateOnReconnect: options.revalidateOnReconnect || true,
    // fallbackData: options.fallbackData, // Example: provide initial data
    ...options, // Allow overriding SWR options from the component
  };

  const { data, error, isLoading, isValidating } = useSWR(
    API_ENDPOINT,
    fetcher,
    swrOptions
  );

  return {
    data, // Expected to be { newsSummaries: [], noEventsFound: boolean }
    isLoading: isLoading || isValidating, // Combine SWR's loading states
    error, // Return the error object directly, as expected by NewsPage.js
  };
};

// Optional: A specific function to explicitly trigger preloading news summary data
// This can be useful for scenarios like preloading on link hover, etc.
export const preloadNewsSummary = () => {
  return preload(API_ENDPOINT, fetcher);
};
