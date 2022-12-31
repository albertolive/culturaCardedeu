import GoogleAdsenseContainer from "../GoogleAdsense";

export default function AdArticle({ isDisplay }) {
  return (
    <div className="flex">
      {isDisplay ? (
        <GoogleAdsenseContainer slot="7838221321" format="auto" responsive />
      ) : (
        <GoogleAdsenseContainer
          slot="3218597262"
          format="fluid"
          layout="in-article"
          style={{ textAlign: "center" }}
        />
      )}
    </div>
  );
}
