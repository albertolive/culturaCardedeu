import useSWR from "swr";

const fetcher = (url, pageIndex, q) =>
  fetch(`${url}?page=${pageIndex}&q=${q}`).then((res) => res.json());

export const useGetEvents = (props, pageIndex, q = "") => {
  return useSWR(["/api/getEvents", pageIndex, q], fetcher, {
    fallbackData: props,
    refreshInterval: 60000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshWhenOffline: true,
  });
};
