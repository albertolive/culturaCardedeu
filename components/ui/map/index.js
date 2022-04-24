import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function Map({ lat = 41.6394024, lng = 2.3591531 }) {
  const googlemap = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyAhgUcp7Mx4ExvD_Ri_yFHZwmnPAgxwPq8",
      version: "weekly",
    });
    loader.load().then(() => {
      const google = window.google;

      const map = new google.maps.Map(googlemap.current, {
        center: { lat, lng },
        zoom: 18,
      });

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
      });
    });
  }, [lat, lng]);
  return <div id="map" ref={googlemap} />;
}
