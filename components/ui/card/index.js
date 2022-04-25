import { Image } from "@components/ui/common";
import Link from "next/link";
import { ClockIcon, LocationMarkerIcon } from "@heroicons/react/outline";

export default function Card({ event }) {
  const image = event.images && event.images[0];

  return (
    <Link href={`/${event.slug}`} passHref>
      <div className="bg-white rounded-xl shadow-md overflow-hidden lg:max-w-2xl cursor-pointer hover:shadow-gray-500/40">
        <div className="flex h-full">
          <div className="flex-1 h-full next-image-wrapper">
            <Image title={event.title} image={image} />
          </div>
          <div className="p-4 flex-2">
            <div className="flex items-center">
              <div className="flex items-center mr-2 tracking-wide text-sm text-[#ECB84A] font-bold">
                {event.nameDay}, {event.formattedStart}
              </div>
              <div></div>
            </div>

            <a className="block mt-1 text-sm sm:text-xl leading-tight font-bold text-black hover:underline">
              {event.title}
            </a>
            <p className="flex mt-2 mb-4 text-sm sm:text-base text-gray-900">
              <LocationMarkerIcon className="h-6 w-6" />
              <span className="ml-1">{event.location}</span>
            </p>
            <div className="mt-2 mb-4 text-sm sm:text-base text-gray-500 ">
              <span className="inline-flex p-1 px-2 rounded-full bg-slate-200 items-center border border-transparent shadow-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-grey-500/40">
                <ClockIcon className="h-6 w-6" />
                <p className="ml-2 ">
                  {event.startTime} - {event.endTime}
                </p>
              </span>
            </div>
            {event.tag && (
              <span className="p-1 px-2 text-white bg-[#ECB84A] relative items-center border border-transparent shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md">
                {event.tag}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
