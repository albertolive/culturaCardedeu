import { useRouter } from "next/router";
import Script from "next/script";
import { generateJsonData } from "@utils/helpers";
import { useGetEvents } from "@components/hooks/useGetEvents";
import Meta from "@components/partials/seo-meta";
import Link from "next/link";

export default function Month({ events }) {
  const { query } = useRouter();
  const { year, month } = query;

  const jsonData = events.map((event) => generateJsonData(event));

  return (
    <>
      <Script
        id="sitemaps-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Meta
        title={`Arxiu del ${month} del ${year} - Cultura Cardedeu`}
        description={`Descobreix què va passar a Cardedeu el ${month} del ${year}. Teatre, cinema, música, art i altres excuses per no parar de descobrir Cardedeu - Arxiu - Cultura Cardedeu`}
        canonical={`https://www.culturacardedeu.com/sitemaps/${year}/${month}`}
      />
      <div className="reset-this mb-2">
        <h1>
          <span className="capitalize">{month}</span> del {year}
        </h1>
      </div>
      {events.map((event) => (
        <div key={event.id} className="py-1 w-fit">
          <Link href={`/${event.slug}`}>
            <a className="hover:underline">
              <p className="text-sm" key={event.id}>
                {event.title} - {event.formattedStart}
              </p>
            </a>
          </Link>
        </div>
      ))}
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { getCalendarEvents } = require("@lib/helpers");
  const { getHistoricDates } = require("@lib/dates");
  const { year, month } = params;

  const { from, until } = getHistoricDates(month, year);

  const { events } = await getCalendarEvents(from, until, false, "", 2500);

  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: { events: normalizedEvents },
  };
}
