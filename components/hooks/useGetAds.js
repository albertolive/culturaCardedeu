import useSWR, { preload } from "swr";

const fetchAds = ([url, size]) =>
  fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}${url}?adSize=${size}`).then(
    (r) => r.json()
  );

export const useGetAds = ({ size }) => {
  preload("/api/getAds", fetchAds);

  return useSWR(["/api/getAds", size], fetchAds, {
    suspense: true,
  });
};
