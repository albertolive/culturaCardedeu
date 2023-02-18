import useSWR, { preload } from "swr";

const fetchAds = ([url, id, size]) =>
  fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}${url}?id=${id}&adSize=${size}`
  ).then((r) => r.json());

export const useGetAds = ({ id, size }) => {
  preload(`/api/getAds`, fetchAds);

  return useSWR([`/api/getAds`, id, size], fetchAds, {});
};
