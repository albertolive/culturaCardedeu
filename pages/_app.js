import "@styles/globals.css";

import { useEffect } from "react";
import Script from "next/script";
import { BaseLayout } from "@components/ui/layout";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";

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
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id="google-analytics-lazy-load" strategy="lazyOnload">
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
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS}`}
      />
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
      <Analytics />
    </>
  );
}

export default CulturaCardedeuMainEntry;
