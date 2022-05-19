import Head from "next/head";
import Link from "next/link";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { SubMenu } from "@components/ui/common";
import { monthsName } from "@utils/helpers";

export default function App(props) {
  const {
    data: { events = [] },
    error,
  } = useGetEvents(props, "all");

  if (error) return <div>failed to load</div>;

  return (
    <>
      <Head>
        <title>Agenda 2022 - Cultura Cardedeu</title>
        <meta
          name="description"
          content="Cultura Cardedeu és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a Cardedeu. L'agenda és col·laborativa."
        />
        <link rel="canonical" href="https://www.culturacardedeu.com/" />
      </Head>
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
        <Link href="/avui-a-cardedeu">
          <a className="font-medium text-black underline">avui</a>
        </Link>
        ,{" "}
        <Link href="/setmana-a-cardedeu">
          <a className="font-medium text-black underline">aquesta setmana</a>
        </Link>
        , o ve,{" "}
        <Link href="/cap-de-setmana-a-cardedeu">
          <a className="font-medium text-black underline">el cap de setmana</a>
        </Link>{" "}
        a Cardedeu. Ja no teniu cap excusa, per no estar al dia, de tot el que
        passa a Cardedeu vinculat a la cultura!
      </p>
      <List events={events}>
        {(event) => <Card key={event.id} event={event} />}
      </List>
    </>
  );
}

export async function getStaticProps() {
  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = new Date();
  const until = new Date(now.setDate(now.getDate() + 15));

  const { events } = await getCalendarEvents(from, until);
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: { events: normalizedEvents },
    revalidate: 60,
  };
}
