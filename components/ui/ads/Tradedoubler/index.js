import Image from "next/image";
import { useGetAds } from "@components/hooks/useGetAds";

export default function TradedoublerIframe({ size = "" }) {
  const { data, error, isLoading, isValidating } = useGetAds({ size });

  if (!Object.keys(data).length) return null;

  const { adId, programId, adSize } = data;
  const [width, height] = adSize.split("x");

  const uri =
    `https://impfr.tradedoubler.com/imp?type(img)g(${adId})a(3299008)` +
    new String(Math.random()).substring(2, 11);

  return (
    <>
      <a
        href={`https://clk.tradedoubler.com/click?p=${programId}&a=3299008&g=${adId}`}
        target="_BLANK"
        rel="noreferrer"
      >
        <Image
          src={uri}
          border="0"
          width={width}
          height={height}
          alt="tradedoubler"
        />
      </a>
    </>
  );
}
