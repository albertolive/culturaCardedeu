import { useEffect } from "react";

const GoogleAdsenseContainer = ({
  style,
  layout,
  format,
  responsive,
  slot,
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const element = document.querySelector('[data-ad-status="unfilled"]');

    // const observer = new MutationObserver((mutations) => {
    //   mutations.forEach((mutation) => {
    //     const { target } = mutation;
    //     debugger;
    //     if (mutation.attributeName === "class") {
    //       const currentState = mutation.target.querySelector(
    //         '[data-ad-status="unfilled"]'
    //       );
    //       if (element !== currentState) {
    //         element = currentState;
    //         console.log(
    //           `'is-busy' class ${currentState ? "added" : "removed"}`
    //         );
    //       }
    //     }
    //   });
    // });
    debugger;
    const observer = new MutationObserver((mutations) => {
      debugger;
      mutations.forEach((mutation) => {
        const el = mutation.target;
        if (
          mutation.target &&
          mutation.target.document.querySelector('[data-ad-status="unfilled"]')
        ) {
          alert("is-busy class added");
        }
      });
    });

    observer.observe(document.querySelector("div"), {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["class"],
    });
  }, []);

  return (
    <ins
      className="adsbygoogle w-full"
      style={{ display: "block", ...style }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
      data-ad-layout={layout}
    ></ins>
  );
};

export default GoogleAdsenseContainer;
