import { Image } from "@components/ui/common";
import Link from "next/link";
import { ClockIcon, LocationMarkerIcon } from "@heroicons/react/outline";

export default function Card({ event, isLoading }) {
  const image = event.images && event.images[0];
  const location =
    event.location.length > 45
      ? event.location.substring(0, 45) + "..."
      : event.location;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden lg:max-w-2xl pointer-events-none cursor-none h-48 md:lg-52 lg:h-56 hover:shadow-gray-500/40">
        <div className="animate-pulse flex h-full">
          <div className="flex-1 h-full next-image-wrapper">
            <div className="h-full bg-slate-200 rounded"></div>
          </div>
          <div className="p-4 flex-2">
            <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
              <div className="h-2 bg-[#ECB84A] opacity-20 rounded"></div>
            </div>
            <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
              <div className="h-2 bg-black opacity-20 rounded"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-200 rounded col-span-2"></div>
              <div className="h-2 bg-slate-200 rounded col-span-1"></div>
            </div>
            <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
            <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              <div className="h-2 bg-slate-200 rounded col-span-2"></div>
            </div>
            <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/${event.slug}`} passHref>
      <div className="bg-white rounded-xl shadow-md overflow-hidden lg:max-w-2xl cursor-pointer hover:shadow-gray-500/40">
        <div className="flex h-full">
          <div className="flex-1 h-full next-image-wrapper">
            <Image
              title={event.title}
              image={image}
              alt={event.title}
              layout="responsive"
            />
          </div>

          <div className="p-4 flex-2">
            <div className="flex items-center">
              <div className="flex items-center mr-2 tracking-wide text-sm text-[#ECB84A] font-bold">
                {event.nameDay}, {event.formattedStart}
              </div>
              <div></div>
            </div>

            <p className="block mt-1 text-sm sm:text-xl leading-tight font-bold text-black hover:underline">
              <a href={`/${event.slug}`}>{event.title}</a>
            </p>
            <p className="flex mt-2 mb-4 text-sm sm:text-base text-gray-900">
              <LocationMarkerIcon className="h-6 w-6" />
              <span className="ml-1">{location}</span>
            </p>
            <div className="mt-2 mb-4 text-sm sm:text-base text-gray-500 ">
              <span className="inline-flex p-1 px-2 rounded-full bg-slate-200 items-center border border-transparent shadow-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-grey-500/40">
                <ClockIcon className="h-6 w-6" />
                <span className="ml-2">
                  {event.startTime} - {event.endTime}
                </span>
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
