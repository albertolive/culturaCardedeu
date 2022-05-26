import Head from "next/head";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { SubMenu } from "@components/ui/common";
import { nextDay } from "@utils/helpers";
import Meta from "@components/partials/seo-meta";
import { CalendarIcon } from "@heroicons/react/solid";

export default function App(props) {
  const {
    data: { events = [] },
    error,
  } = useGetEvents(props, "week");

  if (error) return <div>failed to load</div>;

  return (
    <>
      <Meta
        title="Què fer aquesta setmana a Cardedeu - Cultura Cardedeu"
        description="Què fer aquesta setmana a Cardedeu. Teniu ganes de gaudir del poble? Teatre, cinema, música, art i altres excuses per no parar de descobrir Cardedeu!"
        canonical="https://www.culturacardedeu.com/setmana-a-cardedeu"
        image="/static/images/banner-cultura-cardedeu.jpeg"
      />
      <SubMenu />
      <div className="reset-this">
        <h1 className="mb-4 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Coses per fer a Cardedeu aquesta setmana
        </h1>
      </div>
      <p className="mb-4 font-bold">
        Us proposem activitats d&apos;oci i cultura a Cardedeu per a tots els
        gustos i butxaques.
      </p>
      <p className="mb-4">
        Teniu ganes de gaudir del poble? Esteu en el lloc correcte! Us hem fet
        una selecció dels plans d&apos;aquesta setmana que engloben el millor de
        tots els àmbits i per a tots els públics. Teatre, cinema, música, art i
        altres excuses per no parar de descobrir Cardedeu!
      </p>
      {events.length > 0 ? (
        <List events={events}>
          {(event) => <Card key={event.id} event={event} />}
        </List>
      ) : (
        <div className="rounded-md bg-blue-50 p-4 mb-4 break-word space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto mt-16 font-bold text-center">
          <div className="flex align-middle justify-center content-center">
            <div className="flex-shrink-0 self-center">
              <CalendarIcon className="h-5 w-5 text-black" aria-hidden="true" />
            </div>
            <div className="ml-3">
              No hi ha esdeveniments aquesta setmana a Cardedeu. Creus que en
              falta algun?{" "}
              <Link href="/publica">
                <a className="font-medium text-black hover:underline">
                  Afegeix-lo
                </a>
              </Link>{" "}
              tu mateix/a!
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  const { getCalendarEvents } = require("@lib/helpers");

  const from = new Date();
  const until = nextDay(0);

  const { events } = await getCalendarEvents(from, until);
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: { events: normalizedEvents },
    revalidate: 60,
  };
}
