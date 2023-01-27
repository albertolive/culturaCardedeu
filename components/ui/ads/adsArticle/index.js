import { useEffect, useRef } from "react";

const atOptions = {
  key: "801dd8f976fcf6411ccb80f4e87bc4f0",
  format: "iframe",
  height: 90,
  width: 728,
  params: {},
};

export default function Banner() {
  const banner = useRef();

  useEffect(() => {
    if (!banner.current.firstChild) {
      const conf = document.createElement("script");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//www.highperformancedformats.com/${atOptions.key}/invoke.js`;
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

      if (banner.current) {
        banner.current.append(conf);
        banner.current.append(script);
      }
    }
  }, []);

  return <div ref={banner}></div>;
}
