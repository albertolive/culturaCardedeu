import React, { useEffect, useState } from "react";

export default function AdArticle({ isDisplay }) {
  const { isLoaded, setIsLoaded } = useState(false);

  useEffect(() => {
    const pushAd = () => {
      try {
        const adsbygoogle = window.adsbygoogle;
        adsbygoogle.push({});
        setIsLoaded(true);
        console.log(adsbygoogle);
      } catch (e) {
        console.error(e);
      }
    };

    let interval = setInterval(() => {
      // Check if Adsense script is loaded every 300ms
      if (window.adsbygoogle) {
        pushAd();
        // clear the interval once the ad is pushed so that function isn't called indefinitely
        clearInterval(interval);
      }
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, [setIsLoaded]);

  useEffect(() => {
    if (window.adsbygoogle && !window.adsbygoogle.loaded) {
      setIsLoaded(false);
      console.log("caca");
    }
  }, [isLoaded, setIsLoaded]);

  if (!isLoaded) return null;

  return (
    <div
      key={typeof window !== "undefined" && window.location.pathname}
      className="flex h-full min-h-[170px] lg:min-h-[230px]"
    >
      {isDisplay ? (
        <ins
          className="adsbygoogle w-full"
          style={{ display: "block" }}
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS}
          data-ad-slot="7838221321"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      ) : (
        <ins
          className="adsbygoogle w-full"
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS}
          data-ad-slot="3218597262"
        ></ins>
      )}
    </div>
  );
}
