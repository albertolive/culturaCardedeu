import { useEffect, useCallback } from "react";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { Image, Notification } from "@components/ui/common";
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
  const router = useRouter();
  const { newEvent } = router.query;
  const { data, error } = useGetEvent(props);

  const handleMapLoad = useCallback(() => {
    setTimeout(() => {
      const map = document.getElementById("mymap");
      const frame = document.createElement("iframe");
      frame.src = map.getAttribute("data-src");
      map.appendChild(frame);
    }, 1500);
  }, []);

  useEffect(() => {
    if (document.readyState === "complete") {
      handleMapLoad();
    } else {
      window.addEventListener("load", handleMapLoad);
      return () => document.removeEventListener("load", handleMapLoad);
    }
  }, [handleMapLoad]);

  if (error) return <div>failed to load</div>;

  const {
    id,
    slug,
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
    imageUploaded,
    startDate,
    endDate,
  } = data.event;

  const descriptionHTML = isHTML(description)
    ? description
    : replaceURLs(description);

  const uploadedImage =
    imageUploaded &&
    `https://res.cloudinary.com/culturaCardedeu/image/upload/v1/culturaCardedeu/${id}`;

  const jsonData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    startDate,
    endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: location,
      address: {
        "@type": "PostalAddress",
        streetAddress: location,
        lat,
        lng,
        addressLocality: "Cardedeu",
        postalCode: "08440",
        addressCountry: "ES",
      },
    },
    image: [uploadedImage, ...images],
    description,
    performer: {
      "@type": "PerformingGroup",
      name: location,
    },
    organizer: {
      "@type": "Organization",
      name: location,
      url: "https://www.culturacardedeu.com",
    },
    offers: {
      "@type": "Offer",
      price: 0,
      isAccessibleForFree: true,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `https://www.culturacardedeu.com/${slug}`,
      validFrom: startDate,
    },
  };

  return (
    <>
      <Script
        id={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Head>
        <title>{`${title} - Cultura Cardedeu`}</title>
        <meta
          name="description"
          content={`Cultura Cardedeu - ${title} - ${nameDay}, ${formattedStart} - ${location}`}
        />
        <link
          rel="canonical"
          href={`https://www.culturacardedeu.com/${slug}`}
        />
        <link
          rel="preload"
          href="/static/images/gMaps.webp"
          as="image"
          type="image/webp"
          crossOrigin
        ></link>
      </Head>
      {newEvent && <Notification title={title} url={slug} />}
      <div className="bg-white">
        <div className="max-w-2xl mx-auto px-4 md:px-0 lg:max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-y-16 gap-x-8 lg:grid-cols-2">
            <div className="prose prose-lg">
              <div className="border-b border-gray-200">
                <h2 className="font-bold text-[#ECB84A]">
                  {nameDay}, {formattedStart}
                </h2>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  {title}
                </h1>
              </div>

              <dl className="mt-6 space-y-10">
                <div>
                  <dt className="text-md font-bold text-gray-900">
                    Descripció
                  </dt>
                  <div className="mt-3 xs:text-sm md:text-md lg:text-sm text-gray-500 break-words">
                    <div
                      dangerouslySetInnerHTML={{ __html: descriptionHTML }}
                    />
                  </div>
                </div>
              </dl>

              {imageUploaded && (
                <dl className="space-y-10">
                  <div className="w-1/2">
                    <div className="rounded-lg bg-gray-100 overflow-hidden">
                      <a
                        href={`https://res.cloudinary.com/culturaCardedeu/image/upload/v1/culturaCardedeu/${id}`}
                        className="pointer"
                        target="_blank"
                        rel="image_src noreferrer"
                      >
                        <Image
                          alt={location}
                          title={location}
                          height={250}
                          width={250}
                          image={`https://res.cloudinary.com/culturaCardedeu/image/upload/c_fill,h_500,w_500/v1/culturaCardedeu/${id}`}
                          className="w-full h-full object-center object-cover"
                        />
                      </a>
                    </div>
                  </div>
                </dl>
              )}

              <dl className="mt-6 space-y-10">
                <div>
                  <dt className="text-md font-bold text-gray-900">Hora</dt>
                  <dd className="mt-3 xs:text-sm md:text-md lg:text-sm text-gray-500">
                    {startTime} - {endTime}
                  </dd>
                </div>
              </dl>

              <dl className="mt-6 space-y-10">
                <div>
                  <dt className="text-md font-bold text-gray-900">Lloc</dt>
                  <dd className="mt-3 xs:text-sm md:text-md lg:text-sm text-gray-500">
                    {location}
                  </dd>
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
                <div
                  className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
                  data-src={`https://www.google.com/maps/embed/v1/place?q=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
                  id="mymap"
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 sm:gap-6 sm:mt-6 lg:gap-8 lg:mt-8">
                {images.length > 0 &&
                  images.map((image) => (
                    <div
                      key={image}
                      className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
                    >
                      <Image
                        alt={location}
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
    </>
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

  if (!event.id) {
    return {
      notFound: true,
    };
  }

  return {
    props: { event },
    revalidate: 60,
  };
}
