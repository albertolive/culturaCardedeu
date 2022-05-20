import useSWR from "swr";

const fetcher = (url, pageIndex) =>
  fetch(`${url}?page=${pageIndex}`).then((res) => res.json());

export const useGetEvents = (props, pageIndex) => {
  return useSWR(["/api/getEvents", pageIndex], fetcher, {
    fallbackData: props,
    refreshInterval: 60000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshWhenOffline: true,
  });
};
