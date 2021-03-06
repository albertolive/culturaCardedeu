import useSWR from "swr";

const fetcher = (url, pageIndex, q, maxResults) =>
  fetch(`${url}?page=${pageIndex}&q=${q}&maxResults=${maxResults}`).then(
    (res) => res.json()
  );

export const useGetEvents = (
  props,
  pageIndex,
  q = "",
  refreshInterval = true,
  maxResults = 50
) => {
  return useSWR(["/api/getEvents", pageIndex, q, maxResults], fetcher, {
    fallbackData: props,
    refreshInterval: refreshInterval ? 60000 : 0,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshWhenOffline: true,
  });
};
