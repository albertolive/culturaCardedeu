import { useState } from "react";
import GoogleAdsenseContainer from "../GoogleAdsense";

export default function AdArticle({ isDisplay }) {
  const [displayAd, setDisplayAd] = useState(true);

  if (!displayAd) return;

  return (
    <div className="flex">
      {isDisplay ? (
        <GoogleAdsenseContainer
          slot="7838221321"
          format="auto"
          responsive
          setDisplayAd={setDisplayAd}
        />
      ) : (
        <GoogleAdsenseContainer
          slot="3218597262"
          format="fluid"
          layout="in-article"
          style={{ textAlign: "center" }}
          setDisplayAd={setDisplayAd}
        />
      )}
    </div>
  );
}
