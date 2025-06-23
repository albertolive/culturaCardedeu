import useSWR, { preload } from "swr";

const fetcher = ([url, pageIndex, q, maxResults, pageNum]) =>
  fetch(
    `${
      process.env.NEXT_PUBLIC_DOMAIN_URL
    }${url}?page=${pageIndex}&q=${q}&maxResults=${maxResults}&pageNum=${
      pageNum || 0
    }`
  ).then((res) => res.json());

export const useGetNews = ({
  props = {},
  pageIndex = "news",
  q = "",
  refreshInterval = true,
  maxResults = 5,
  pageNum = 0,
}) => {
  preload(["/api/getEvents", pageIndex, q, maxResults, pageNum], fetcher);

  const swrResult = useSWR(
    ["/api/getEvents", pageIndex, q, maxResults, pageNum],
    fetcher,
    {
      fallbackData: props,
      refreshInterval: refreshInterval ? 300000 : 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshWhenOffline: false,
      suspense: false, // Disable suspense to avoid hydration issues
      keepPreviousData: false,
      revalidateIfStale: false, // Don't revalidate stale data on mount
      revalidateOnMount: true, // But do revalidate on component mount
      dedupingInterval: 5000, // Dedupe requests for 5 seconds
    }
  );

  // Ensure consistency between SSR and client data
  const hasClientData =
    swrResult.data && !swrResult.isLoading && !swrResult.error;
  const shouldUseFallback =
    !hasClientData && props && props.newsSummaries?.length > 0;

  return {
    ...swrResult,
    data: shouldUseFallback ? props : swrResult.data || props,
  };
};
