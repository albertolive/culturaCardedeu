export default function AmazonIframe({ category }) {
  let bannerMd;
  let bannerSm;

  switch (category) {
    case "prime_video":
      bannerMd = "1WM3P83JBRAEDHZ74YR2";
      bannerSm = "093TP09QSWSGKXVP9S82";
    case "kindle_unlimited":
      bannerMd = "1J0SP8MJCYHK1HCQC302";
      bannerSm = "0A8ZM7ZCCKPJH18EHF02";
  }
  return (
    <>
      <div className="hidden md:block">
        <iframe
          src={`https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=48&l=ur1&category=${category}&banner=${bannerMd}&f=ifr&linkID={{link_id}}&t=albertolive-21&tracking_id=albertolive-21`}
          width="728"
          height="90"
          border="0"
          style={{ border: "none" }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
        ></iframe>
      </div>
      <div className="block md:hidden">
        <iframe
          src={`https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=48&l=ur1&category=${category}&banner=${bannerSm}&f=ifr&linkID={{link_id}}&t=albertolive-21&tracking_id=albertolive-21`}
          width="300"
          height="250"
          border="0"
          style={{ border: "none" }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
        ></iframe>
      </div>
    </>
  );
}
