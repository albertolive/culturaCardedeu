import Script from "next/script";
import { useEffect, useRef } from "react";

const atOptions = {
  key: "801dd8f976fcf6411ccb80f4e87bc4f0",
  format: "iframe",
  height: 90,
  width: 728,
  params: {},
};

export default function Banner() {
  const adRef = useRef(null);
  useEffect(() => {
    try {
      (window.AdProvider = window.AdProvider || []).push({ serve: {} });
    } catch (err) {
      console.log("adsense error", err);
    }
  }, []);

  //   const banner = useRef();

  //   useEffect(() => {
  //     if (!banner.current.firstChild) {
  //       const conf = document.createElement("script");
  //       const script = document.createElement("script");
  //       script.type = "text/javascript";
  //       script.src = `//www.highperformancedformats.com/${atOptions.key}/invoke.js`;
  //       conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

  //       if (banner.current) {
  //         banner.current.append(conf);
  //         banner.current.append(script);
  //       }
  //     }
  //   }, []);

  return (
    <>
      <Script id="adsbyexoclick"></Script>
      <ins ref={adRef} className="adsbyexoclick" data-zoneid="4901056"></ins>
    </>
  );
}
