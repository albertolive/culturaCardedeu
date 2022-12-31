import GoogleAdsenseContainer from "../GoogleAdsense";

export default function AdCard({ event }) {
  return (
    <div
      key={event.id}
      className="bg-white rounded-xl shadow-md overflow-hidden lg:max-w-2xl cursor-pointer hover:shadow-gray-500/40"
    >
      <div className="flex">
        <GoogleAdsenseContainer slot="9596766377" responsive />
      </div>
    </div>
  );
}
