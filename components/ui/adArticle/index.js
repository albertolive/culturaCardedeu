import { useState } from "react";
import GoogleAdsenseContainer from "../GoogleAdsense";

export default function AdArticle({ isDisplay = true, slot }) {
  const [displayAd, setDisplayAd] = useState(true);

  if (true) return;

  return (
    <div id="ad-article-slot" className="flex">
      <GoogleAdsenseContainer
        slot={slot}
        format={isDisplay ? "auto" : "fluid"}
        responsive={isDisplay}
        layout={isDisplay ? "" : "in-article"}
        style={{ textAlign: isDisplay ? "initial" : "center" }}
        setDisplayAd={setDisplayAd}
      />
    </div>
  );
}
