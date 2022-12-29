import React, { useEffect } from "react";

export default function AdCard({ event }) {
  useEffect(() => {
    const pushAd = () => {
      try {
        const adsbygoogle = window.adsbygoogle;
        console.log({ adsbygoogle });
        adsbygoogle.push({});
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
  }, []);

  return (
    <div
      key={event.id}
      className="bg-white rounded-xl shadow-md overflow-hidden lg:max-w-2xl cursor-pointer hover:shadow-gray-500/40"
    >
      <div className="flex h-full min-h-[170px] lg:min-h-[230px]">
        <ins
          className="adsbygoogle w-full"
          style={{ display: "block" }}
          data-ad-format="fluid"
          data-ad-layout-key="-gw-1q+20-6g+hq"
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS}
          data-ad-slot="6735633460"
        ></ins>
      </div>
    </div>
  );
}
