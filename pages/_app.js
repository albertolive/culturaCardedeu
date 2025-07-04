import "@styles/globals.css";

import { useEffect } from "react";
import Script from "next/script";
import { BaseLayout } from "@components/ui/layout";
import { useRouter } from "next/router";
import { Notification } from "@components/ui/common";

function CulturaCardedeuMainEntry({ Component, pageProps }) {
  const { events } = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (
        (typeof window !== "undefined" &&
          window.localStorage !== undefined &&
          localStorage.getItem("searchTerm") &&
          url === "/") ||
        url === "/avui-a-cardedeu" ||
        url === "/setmana-a-cardedeu" ||
        url === "/cap-de-setmana-a-cardedeu" ||
        url === "/qui-som" ||
        url === "/publica"
      ) {
        localStorage.setItem("searchTerm", JSON.stringify(""));
      }
    };

    events.on("routeChangeComplete", handleRouteChange);

    return () => {
      events.off("routeChangeComplete", handleRouteChange);
    };
  }, [events]);

  return (
    <>
      <Script
        id="google-analytics-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id="google-analytics-lazy-load">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
        });
    `}
      </Script>
      <Script
        id="google-ads"
        strategy="lazyOnload"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS}`}
      />

      <BaseLayout>
        <Notification
          type="success"
          hideClose
          customNotification={false}
          title={`Cultura Cardedeu s&apos;ha ampliat i ara també es pot trobar a <b><u><a target="_blank" href="https://www.esdeveniments.cat">esdeveniments.cat</a></b></u>! Quan publiqueu un esdeveniment aquí, també es publicarà automàticament a la nostra nova pàgina web.`}
        />
        <Component {...pageProps} />
      </BaseLayout>
    </>
  );
}

export default CulturaCardedeuMainEntry;
