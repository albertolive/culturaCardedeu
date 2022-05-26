import Card from "@components/ui/card";
import List from "@components/ui/list";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { SubMenu } from "@components/ui/common";
import { nextDay, isWeekend } from "@utils/helpers";
import Meta from "@components/partials/seo-meta";
import { CalendarIcon } from "@heroicons/react/solid";

export default function App(props) {
  const {
    data: { events = [] },
    error,
  } = useGetEvents(props, "weekend");

  if (error) return <div>failed to load</div>;

  return (
    <>
      <Meta
        title="Què fer aquest cap de setmana a Cardedeu - Cultura Cardedeu"
        description="Què fer aquest cap de setmana a Cardedeu. Les millors propostes culturals per esprémer al màxim el cap de setmana, de divendres a diumenge."
        canonical="https://www.culturacardedeu.com/cap-de-setmana-a-cardedeu"
        image="/static/images/banner-cultura-cardedeu.jpeg"
      />
      <SubMenu />
      <div className="reset-this">
        <h1 className="mb-4 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Què fer aquest cap de setmana a Cardedeu
        </h1>
      </div>
      <p className="mb-4 font-bold">
        Les millors propostes per esprémer al màxim el cap de setmana a
        Cardedeu, de divendres a diumenge.
      </p>
      <p className="mb-4">
        Hem bussejat en l&apos;agenda cultural de Cardedeu i us portem una tria
        del milloret que podreu fer aquest cap de setmana al poble. Art, cinema,
        teatre... No teniu excusa, us espera un cap de setmana increïble sense
        moure-us de Cardedeu.{" "}
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
              No hi ha esdeveniments aquest cap de setmana a Cardedeu. Creus que
              en falta algun?{" "}
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

  const from = isWeekend() ? new Date() : nextDay(5);
  const until = nextDay(0);

  const { events } = await getCalendarEvents(from, until);
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: { events: normalizedEvents },
    revalidate: 60,
  };
}
