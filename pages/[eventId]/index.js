import { useEffect, useCallback } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import Link from "next/link";
import { Image, Notification, Social } from "@components/ui/common";
import { useGetEvent } from "@components/hooks/useGetEvent";
import Meta from "@components/partials/seo-meta";
import { generateJsonData } from "@utils/helpers";

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

function truncate(source, size, addDots = false) {
  return source.slice(0, size - 3) + (addDots ? "..." : "");
}

function generateMetaDescription(title, description) {
  const titleSanitized = title.replace(/(<([^>]+)>)/gi, "");
  let text = titleSanitized;

  if (text.length < 156) {
    const descriptionSanitized = description
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/"/gi, "")
      .replace(/^\s+|\s+$/g, "");

    text += ` - ${descriptionSanitized}`;
  }

  text = text.replace(/^(.{156}[^\s]*).*/, "$1");

  if (text.length > 156 - 3) {
    text = truncate(text, 156, true);
  }

  return text;
}

function generateMetaTitle(title, alternativeText, location) {
  const titleSanitized = title.replace(/(<([^>]+)>)/gi, "");
  let text = titleSanitized;

  text = text.replace(/^(.{60}[^\s]*).*/, "$1");

  if (text.length > 60) {
    text = truncate(text, 37);
    text = `${text} - ${alternativeText}`;
    text = truncate(text, 60);
  } else if (text.length !== 60) {
    text = truncate(text, 37);
    text = `${text} - ${alternativeText}`;

    if (text.length > 60) text = truncate(text, 60);
  }

  if (text.length < 60) {
    text = `${text} - ${location}`;
    text = truncate(text, 60);
  }

  text = text.replace(/^(.{53}[^\s]*).*/, "$1");

  return text;
}

export default function Event(props) {
  const { push, query, asPath } = useRouter();
  const { newEvent } = query;
  const { data, error } = useGetEvent(props);
  const slug = data.event ? data.event.slug : "";

  useEffect(() => {
    if (slug && asPath !== `/${slug}`) push(slug, undefined, { shallow: true });
  }, [asPath, data, push, slug]);

  const handleMapLoad = useCallback(() => {
    setTimeout(() => {
      const map = document.getElementById("mymap");
      const frame = document.createElement("iframe");
      if (!map) return;

      frame.src = map.getAttribute("data-src");
      map.appendChild(frame);
    }, 1500);
  }, []);

  useEffect(() => {
    if (document.readyState === "complete") {
      handleMapLoad();
    } else {
      window.addEventListener("load", handleMapLoad);
      return () => window.removeEventListener("load", handleMapLoad);
    }
  }, [handleMapLoad]);

  if (error) return <div>failed to load</div>;

  const {
    id,
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
    social,
  } = data.event;

  const descriptionHTML = isHTML(description)
    ? description
    : replaceURLs(description);

  const uploadedImage = imageUploaded
    ? `https://res.cloudinary.com/culturaCardedeu/image/upload/v1/culturaCardedeu/${id}`
    : null;

  const jsonData = generateJsonData({ ...data.event, uploadedImage });

  return (
    <>
      <Script
        id={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Meta
        title={generateMetaTitle(title, "Cultura Cardedeu", location)}
        description={generateMetaDescription(
          `${title} - ${nameDay} ${formattedStart} - ${location}`,
          description
        )}
        canonical={`https://www.culturacardedeu.com/${slug}`}
        image={images[0]}
        preload="/static/images/gMaps.webp"
      />
      {newEvent && <Notification title={title} url={slug} />}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/">
              <a className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-yellow-400 dark:text-gray-400 dark:hover:text-white">
                <svg
                  className="mr-2 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Agenda
              </a>
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-400 md:ml-2 dark:text-gray-500">
                {title}
              </span>
            </div>
          </li>
        </ol>
      </nav>
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
                    <dt className="text-md font-bold text-gray-900">Tags</dt>
                    <dd className="mt-3 text-sm text-gray-500">{tag}</dd>
                  </div>
                </dl>
              )}

              {social && (
                <dl className="mt-6">
                  <dt className="text-md font-bold text-gray-900">Enllaços</dt>
                  <Social links={social} />
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
  const { twoWeeksDefault } = require("@lib/dates");

  const { from, until } = twoWeeksDefault();
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
