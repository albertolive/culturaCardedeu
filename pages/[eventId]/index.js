import ReactHtmlParser from "react-html-parser";
import { Image } from "@components/ui/common";
import { useGetEvent } from "@components/hooks/useGetEvent";

function replaceURLs(text) {
  if (!text) return;

  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    var hyperlink = url;
    if (!hyperlink.match("^https?://")) {
      hyperlink = "http://" + hyperlink;
    }
    return (
      '<a href="' +
      hyperlink +
      '" target="_blank" rel="noopener noreferrer">' +
      url +
      "</a>"
    );
  });
}

function isHTML(text) {
  if (!text) return;

  return text.match(/<[a-z][\s\S]*>/i);
}

export default function Event(props) {
  const { data, error } = useGetEvent(props);

  if (error) return <div>failed to load</div>;

  const {
    title,
    description,
    location,
    startTime,
    endTime,
    nameDay,
    formattedStart,
    tag,
    images = [],
    lat,
    lng,
  } = data.event;

  const descriptionHTML = isHTML(description)
    ? description
    : replaceURLs(description);

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid items-center grid-cols-1 gap-y-16 gap-x-8 lg:grid-cols-2">
          <div>
            <div className="border-b border-gray-200 pb-10">
              <h2 className="font-medium text-gray-500">
                {nameDay}, {formattedStart}
              </h2>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {title}
              </p>
            </div>

            <dl className="mt-6 space-y-10">
              <div>
                <dt className="text-md font-medium text-gray-900">
                  Descripció
                </dt>
                <dd className="mt-3 text-sm text-gray-500">
                  {ReactHtmlParser(descriptionHTML)}
                </dd>
              </div>
            </dl>

            <dl className="mt-6 space-y-10">
              <div>
                <dt className="text-md font-medium text-gray-900">Hora</dt>
                <dd className="mt-3 text-sm text-gray-500">
                  {startTime} - {endTime}
                </dd>
              </div>
            </dl>

            <dl className="mt-6 space-y-10">
              <div>
                <dt className="text-md font-medium text-gray-900">Lloc</dt>
                <dd className="mt-3 text-sm text-gray-500">{location}</dd>
              </div>
            </dl>

            {tag && (
              <dl className="mt-6 space-y-10">
                <div>
                  <dt className="text-md font-medium text-gray-900">Tags:</dt>
                  <dd className="mt-3 text-sm text-gray-500">{tag}</dd>
                </div>
              </dl>
            )}
          </div>

          <div>
            <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
              <iframe
                style={{ border: 0 }}
                loading="lazy"
                allowfullscreen
                src={`https://www.google.com/maps/embed/v1/place?q=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
              ></iframe>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 sm:gap-6 sm:mt-6 lg:gap-8 lg:mt-8">
              {images.length > 0 &&
                images.map((image) => (
                  <div
                    key={image}
                    className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
                  >
                    <Image
                      title={location}
                      image={image}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = now;
  const until = new Date(now.getFullYear(), now.getMonth() + 1);

  const { events } = await getCalendarEvents(from, until);
  const eventsSlug = events.map((c) => ({ params: { eventId: c.slug } }));

  return {
    paths: eventsSlug,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { getCalendarEvent } = require("@lib/helpers");
  const eventId = params.eventId;
  const { event } = await getCalendarEvent(eventId);

  return {
    props: { event },
    // revalidate: 10,
  };
}
