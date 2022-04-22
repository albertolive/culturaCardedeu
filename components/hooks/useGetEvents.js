import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const useGetEvents = (props) => {
  return useSWR("/api/getEvents", fetcher, {
    fallbackData: props,
    refreshInterval: 60000,
  });
};
