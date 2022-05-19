import Head from "next/head";
import { useRouter } from "next/router";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { SubMenu } from "@components/ui/common";
import { nextDay, isWeekend } from "@utils/helpers";

export default function App(props) {
  const router = useRouter();
  const {
    data: { events = [] },
    error,
  } = useGetEvents(props, "weekend");

  if (error) return <div>failed to load</div>;

  return (
    <>
      <Head>
        <title>
          Què fer aquest cap de setmana a Cardedeu - Cultura Cardedeu
        </title>
        <meta
          name="description"
          content="Què fer aquest cap de setmana a Cardedeu. Cultura Cardedeu és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a Cardedeu."
        />
        <link rel="canonical" href="https://www.culturacardedeu.com/" />
      </Head>
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
        Hem bussejat en l'agenda cultural de Cardedeu i us portem una tria del
        milloret que podreu fer aquest cap de setmana al poble. Art, cinema,
        teatre... No teniu excusa, us espera un cap de setmana increïble sense
        moure-us de Cardedeu.{" "}
      </p>
      <List events={events}>
        {(event) => <Card key={event.id} event={event} />}
      </List>
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
