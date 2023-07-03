import "@styles/globals.css";

import { useEffect } from "react";
import Script from "next/script";
import { BaseLayout } from "@components/ui/layout";
import { useRouter } from "next/router";

function Buymeacoffee() {
  useEffect(() => {
    const script = document.createElement("script");
    const div = document.getElementById("supportByBMC");
    script.setAttribute(
      "src",
      "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
    );
    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-id", "CulturaCardedeu");
    script.setAttribute("data-description", "Regala'm cultura :)");
    script.setAttribute(
      "data-message",
      "Cultura Cardedeu és un projecte participatiu per descobrir de manera ràpida i senzilla tots els esdeveniments culturals que tenen lloc a Cardedeu. Amb la vostra col·laboració, ens ajudeu a mantenir els servidors que fan possible aquesta iniciativa!"
    );
    script.setAttribute("data-color", "#ECB84A");
    script.setAttribute("data-position", "Right");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");

    script.onload = function () {
      var evt = document.createEvent("Event");
      evt.initEvent("DOMContentLoaded", false, false);
      window.dispatchEvent(evt);
    };

    div.appendChild(script);
  }, []);

  return <div id="supportByBMC"></div>;
}


function CulturaCardedeuMainEntry({ Component, pageProps }) {
  const { events } = useRouter();
  const infolinks_pid = 3386219;
  const infolinks_wsid = 0;

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
        <Component {...pageProps} />
        <Buymeacoffee />
      </BaseLayout>
    </>
  );
}

export default CulturaCardedeuMainEntry;
