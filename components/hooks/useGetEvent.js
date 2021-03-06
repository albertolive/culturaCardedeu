import useSWR from "swr";

const fetchWithId = (url, id) =>
  fetch(`${url}?eventId=${id}`).then((r) => r.json());

export const useGetEvent = (props) => {
  const eventId = props.event.slug;

  return useSWR([eventId ? `/api/getEvent` : null, eventId], fetchWithId, {
    fallbackData: props,
    refreshInterval: 60000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshWhenOffline: true,
  });
};
