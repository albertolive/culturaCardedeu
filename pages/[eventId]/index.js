import { useEffect, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useRouter } from "next/router";
import Link from "next/link";
import { useGetEvent } from "@components/hooks/useGetEvent";
import Meta from "@components/partials/seo-meta";
import { generateJsonData } from "@utils/helpers";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import XCircleIcon from "@heroicons/react/outline/XCircleIcon";

const AdArticle = dynamic(() => import("@components/ui/adArticle"), {
  loading: () => "",
  ssr: false,
});

const Image = dynamic(() => import("@components/ui/common/image"), {
  loading: () => "",
});

const Modal = dynamic(() => import("@components/ui/common/modal"), {
  loading: () => "",
});

const NoEventFound = dynamic(
  () => import("@components/ui/common/noEventFound"),
  {
    loading: () => "",
  }
);

const Notification = dynamic(
  () => import("@components/ui/common/notification"),
  {
    loading: () => "",
  }
);

const Social = dynamic(() => import("@components/ui/common/social"), {
  loading: () => "",
});

const Weather = dynamic(() => import("@components/ui/weather"), {
  loading: () => "",
});

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

const sendGoogleEvent = (event, obj) =>
  typeof window !== "undefined" &&
  window.gtag &&
  window.gtag("event", event, { ...obj });

export default function Event(props) {
  const { push, query, asPath } = useRouter();
  const { newEvent, edit_suggested = false } = query;
  const [openModal, setOpenModal] = useState(!!newEvent);
  const [openDeleteReasonModal, setOpenModalDeleteReasonModal] =
    useState(false);
  const [showThankYouBanner, setShowThankYouBanner] = useState(edit_suggested);
  const [reasonToDelete, setReasonToDelete] = useState(null);
  const { data, error } = useGetEvent(props);
  const slug = data.event ? data.event.slug : "";
  const title = data.event ? data.event.title : "";

  useEffect(() => {
    if (newEvent || edit_suggested) return;

    if (title !== "CANCELLED" && slug && asPath !== `/${slug}`) {
      console.log("push", slug);
      console.log("asPath", asPath);
    }
    // push(slug, undefined, { shallow: true });
  }, [asPath, data, edit_suggested, newEvent, push, slug, title]);

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

  const onSendDeleteReason = async () => {
    const { id, title } = data.event;
    setOpenModalDeleteReasonModal(false);

    const rawResponse = await fetch(process.env.NEXT_PUBLIC_DELETE_EVENT, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title, reason: reasonToDelete }),
    });

    const { success } = await rawResponse.json();

    if (success) setShowThankYouBanner(true);

    sendGoogleEvent("send-delete", {
      value: reasonToDelete,
    });
  };

  if (error) return <div>failed to load</div>;

  const {
    id,
    description,
    location,
    startDate,
    startTime,
    endTime,
    nameDay,
    formattedStart,
    formattedEnd,
    tag,
    images = [],
    lat,
    lng,
    imageUploaded,
    imageId,
    social,
    isEventFinished,
    isMoney,
    eventImage,
  } = data.event;

  const descriptionHTML = isHTML(description)
    ? description
    : replaceURLs(description);

  const jsonData = generateJsonData({ ...data.event, imageUploaded });

  if (title === "CANCELLED") return <NoEventFound />;

  const gMapsQuery =
    lat && lng
      ? `${lat},${lng}`
      : isMoney
      ? location
      : `${location},Cardedeu+08440`;

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
        imageUploaded={imageUploaded || eventImage}
        preload="/static/images/gMaps.webp"
      />
      {showThankYouBanner && (
        <Notification
          type="success"
          customNotification={false}
          hideClose
          hideNotification={setShowThankYouBanner}
          title="Gràcies per contribuir a millorar el contingut de Cultura Cardedeu! En menys de 24 hores estarà disponible el canvi."
        />
      )}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" prefetch={false}>
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
          <div className="grid items-center grid-cols-1 gap-y-16 gap-x-8">
            <div className="prose prose-lg max-w-none">
              {isEventFinished && (
                <div className="-mb-8 lg:-mb-4 mt-8">
                  <span className="font-bold text-black rounded-full p-2 px-4 bg-[#ECB84A] text-sm">
                    Esdeveniment finalitzat
                  </span>
                </div>
              )}
              <div className="border-b border-gray-200">
                <h2 className="font-bold text-[#ECB84A]">
                  {formattedEnd
                    ? `Del ${formattedStart} al ${formattedEnd}`
                    : `${nameDay}, ${formattedStart}`}
                </h2>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  {title}
                </h1>
              </div>
              <div className="mt-6 space-y-10 min-h-[325px] lg:min-h-[100px] h-full">
                <AdArticle slot="1256471228" />
              </div>
              <dl className="mt-6 space-y-10">
                <div>
                  <div className="flex items-center">
                    <dt className="text-md font-bold text-gray-900">
                      Descripció
                    </dt>
                    {!isMoney && (
                      <div className="ml-auto">
                        <button
                          onClick={() => {
                            setOpenModal(true);
                            sendGoogleEvent("open-change-modal");
                          }}
                          type="button"
                          className="relative inline-flex items-center px-4 py-2 border border-slate-200  text-xs font-medium rounded-full text-gray-800 bg-white hover:border-[#ECB84A] focus:outline-none"
                        >
                          <PencilIcon
                            className="-ml-1 mr-2 h-5 w-5 text-[#ECB84A] text-xs"
                            aria-hidden="true"
                          />
                          <span className="text-gray-800">
                            Suggerir un canvi
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                  <Weather startDate={startDate} />
                  <div
                    className="mt-3 xs:text-sm md:text-md lg:text-sm text-gray-500 break-words"
                    id="description"
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: descriptionHTML }}
                    />
                  </div>
                </div>
              </dl>

              {imageUploaded && (
                <dl className="space-y-10" id="image">
                  <div className="w-1/2">
                    <div className="rounded-lg bg-gray-100 overflow-hidden">
                      <a
                        href={`https://res.cloudinary.com/culturaCardedeu/image/upload/v1/culturaCardedeu/${imageId}`}
                        className="pointer"
                        target="_blank"
                        rel="image_src noreferrer"
                      >
                        <Image
                          alt={location}
                          title={location}
                          height={250}
                          width={250}
                          image={imageUploaded}
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
                  <dd
                    className="mt-3 xs:text-sm md:text-md lg:text-sm text-gray-500"
                    id="location"
                  >
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${location}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {location}
                    </a>
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
              <div className="mt-6 space-y-10 min-h-[280px] lg:min-h-[100px] h-full">
                <AdArticle slot="8822317665" />
              </div>
            </div>
            {!isMoney && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
                  <div
                    className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
                    data-src={`https://www.google.com/maps/embed/v1/place?q=${gMapsQuery}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
                    id="mymap"
                  ></div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-2 grid-rows-1 lg:grid-rows-2 gap-4 mt-4 sm:gap-6 sm:mt-6 lg:gap-8 lg:mt-0">
                  {images.length > 0 &&
                    images.map((image) => (
                      <div
                        key={image}
                        className="lg:col-start-1 aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
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
            )}
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        title={
          newEvent
            ? "🎉 Esdeveniment Publicat amb Èxit!"
            : "Suggereix una edició"
        }
      >
        {newEvent && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 mb-3">
              <strong>Fantàstic!</strong> El teu esdeveniment{" "}
              <strong>&quot;{title}&quot;</strong> ja és visible per a tothom a
              Cultura Cardedeu!
            </p>
            <p className="text-xs text-green-700">
              Pots editar qualsevol detall del teu esdeveniment en qualsevol
              moment utilitzant les opcions de sota:
            </p>
          </div>
        )}
        <ul role="list" className="divide-y divide-gray-200 text-left">
          <li key="edit" className="py-4 flex">
            <Link href={`/${slug}/edita`} prefetch={false}>
              <a
                onClick={() => {
                  if (newEvent) {
                    // Clean up the newEvent query parameter when navigating to edit
                    const { newEvent: _, ...cleanQuery } = query;
                    push({
                      pathname: `/${slug}/edita`,
                      query: cleanQuery,
                    });
                  }
                }}
              >
                <div className="flex items-center">
                  <PencilIcon
                    className="h-7 w-7 text-[#ECB84A] text-xs"
                    aria-hidden="true"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {newEvent
                        ? "Edita el teu esdeveniment"
                        : "Canvia el títol o altres detalls"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {newEvent
                        ? "Modifica el títol, descripció, ubicació, horari, etc."
                        : "Edita el títol, la ubicació, l&apos;horari, etc."}
                    </p>
                  </div>
                </div>
              </a>
            </Link>
          </li>
          {!newEvent && (
            <li key="remove" className="py-4 flex">
              <div
                className="cursor-pointer"
                as="button"
                onClick={() => {
                  setOpenModal(false);
                  setTimeout(() => setOpenModalDeleteReasonModal(true), 300);
                  sendGoogleEvent("open-delete-modal");
                }}
              >
                <div className="flex items-center">
                  <XCircleIcon
                    className="h-7 w-7 text-[#ECB84A] text-xs"
                    aria-hidden="true"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Eliminar
                    </p>
                    <p className="text-sm text-gray-500">
                      L&apos;esdeveniment no existeix, està duplicat, etc.
                    </p>
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>
        {newEvent && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Què passa ara?
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>
                    • L&apos;esdeveniment apareixerà a l&apos;agenda principal
                  </li>
                  <li>
                    • La gent el podrà trobar cercant per data, ubicació o
                    paraules clau
                  </li>
                  <li>
                    • Pots compartir l&apos;enllaç d&apos;aquesta pàgina per
                    promocionar-lo
                  </li>
                  <li>
                    • Sempre pots tornar a editar-lo utilitzant el botó
                    &quot;Suggerir un canvi&quot; d&apos;aquesta pàgina
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={openDeleteReasonModal}
        setOpen={setOpenModalDeleteReasonModal}
        title="Suggereix una el·liminació"
      >
        <>
          <div className="text-sm font-medium text-gray-900">
            Motiu de l&apos;el·liminació suggerida
          </div>
          <fieldset className="space-y-5">
            <legend className="sr-only">Sol·licitud d&apos;eliminació</legend>
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="not-exist"
                  checked={reasonToDelete === "not-exist"}
                  onChange={() => setReasonToDelete("not-exist")}
                  aria-describedby="not-exist-description"
                  name="not-exist"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="not-exist"
                  className="font-medium text-gray-700"
                >
                  No existeix
                </label>
              </div>
            </div>
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="duplicated"
                  checked={reasonToDelete === "duplicated"}
                  onChange={() => setReasonToDelete("duplicated")}
                  aria-describedby="duplicated-description"
                  name="duplicated"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="duplicated"
                  className="font-medium text-gray-700"
                >
                  Duplicat
                </label>
              </div>
            </div>
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="offensive"
                  checked={reasonToDelete === "offensive"}
                  onChange={() => setReasonToDelete("offensive")}
                  aria-describedby="offensive-description"
                  name="offensive"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="offensive"
                  className="font-medium text-gray-700"
                >
                  Ofensiu, nociu o enganyós
                </label>
              </div>
            </div>
            <div className="relative flex items-start text-left">
              <div className="flex items-center h-5">
                <input
                  id="others"
                  checked={reasonToDelete === "others"}
                  onChange={() => setReasonToDelete("others")}
                  aria-describedby="others-description"
                  name="others"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="others" className="font-medium text-gray-700">
                  Altres
                </label>
                <p id="offers-description" className="text-gray-500">
                  Envieu un correu amb el motiu a:{" "}
                  <a
                    className="hover:text-[#ECB84A]"
                    href="mailto:hola@culturacardedeu.com"
                  >
                    hola@culturacardedeu.com
                  </a>
                </p>
              </div>
            </div>
          </fieldset>
          <div className="flex mt-3 justify-end">
            <button
              disabled={!reasonToDelete}
              onClick={onSendDeleteReason}
              className="disabled:opacity-50 disabled:cursor-default disabled:hover:bg-[#ECB84A] ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ECB84A] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
            >
              Enviar
            </button>
          </div>
        </>
      </Modal>
    </>
  );
}

export async function getStaticPaths() {
  const { getCalendarEvents } = require("@lib/helpers");
  const { twoWeeksDefault } = require("@lib/dates");

  const { from, until } = twoWeeksDefault();
  const { events } = await getCalendarEvents({
    from,
    until,
  });
  const eventsSlug = events
    .filter((event) => !event.isAd)
    .map((c) => ({ params: { eventId: c.slug } }));

  return {
    paths: eventsSlug,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { getCalendarEvent } = require("@lib/helpers");
  const eventId = params.eventId;

  const { event } = await getCalendarEvent(eventId);

  if (!event || !event.id) {
    return {
      notFound: true,
    };
  }

  return {
    props: { event },
    revalidate: 60,
  };
}
