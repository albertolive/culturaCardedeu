export default function AdArticle({ isDisplay }) {
  return (
    <div className="flex h-full min-h-[170px] lg:min-h-[230px]">
      {isDisplay ? (
        <ins
          className="adsbygoogle w-full"
          style={{ display: "block" }}
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS}
          data-ad-slot="7838221321"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      ) : (
        <ins
          className="adsbygoogle w-full"
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS}
          data-ad-slot="3218597262"
        ></ins>
      )}
      {/* <script>if (!adsbygoogle.loaded) {console.log("caca")}</script> */}
    </div>
  );
}
