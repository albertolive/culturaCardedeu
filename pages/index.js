import Link from "next/link";
import Script from "next/script";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { useGetEvents } from "@components/hooks/useGetEvents";
import SubMenu from "@components/ui/common/subMenu";
import { monthsName, generateJsonData } from "@utils/helpers";
import Meta from "@components/partials/seo-meta";

export default function App(props) {
  const {
    data: { events = [] },
    error,
    isValidating,
  } = useGetEvents(props, "all");

  if (error) return <div>failed to load</div>;

  const isLoading = (!events && !error) || isValidating;

  const jsonData = events.map((event) => generateJsonData(event));

  return (
    <>
      <Script
        id="agenda-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Meta
        title="Agenda 2022 - Cultura Cardedeu"
        description="Cultura Cardedeu és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a Cardedeu. L'agenda és col·laborativa."
        canonical="https://www.culturacardedeu.com/"
      />
      <SubMenu />
      <div className="reset-this">
        <h1 className="mb-4 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Agenda Cardedeu 2022
        </h1>
      </div>
      <p className="mb-4 font-bold">
        Les millors coses per fer a Cardedeu: mercats, exposicions,
        descobriments, passejades, concerts, museus, teatre... Aquests són els
        millors plans per gaudir de Cardedeu al{" "}
        {monthsName[new Date().getMonth()]}!
      </p>
      <p className="mb-4">
        Us donem un ventall de possibilitats perquè no us quedi temps per
        avorrir-vos. La cultura no descansa. Podeu veure què passa{" "}
        <Link href="/avui-a-cardedeu" prefetch={false}>
          <a className="font-medium text-black underline">avui</a>
        </Link>
        ,{" "}
        <Link href="/setmana-a-cardedeu" prefetch={false}>
          <a className="font-medium text-black underline">aquesta setmana</a>
        </Link>
        , o ve,{" "}
        <Link href="/cap-de-setmana-a-cardedeu" prefetch={false}>
          <a className="font-medium text-black underline">el cap de setmana</a>
        </Link>{" "}
        a Cardedeu. Ja no teniu cap excusa, per no estar al dia, de tot el que
        passa a Cardedeu vinculat a la cultura!
      </p>
      <List events={events}>
        {(event) => <Card key={event.id} event={event} isLoading={isLoading} />}
      </List>
    </>
  );
}

export async function getStaticProps() {
  const { getCalendarEvents } = require("@lib/helpers");
  const { twoWeeksDefault } = require("@lib/dates");

  const { from, until } = twoWeeksDefault();

  const { events } = await getCalendarEvents({
    from,
    until,
  });
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: { events: normalizedEvents },
    revalidate: 60,
  };
}
