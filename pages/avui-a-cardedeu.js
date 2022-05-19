import Head from "next/head";
import { useRouter } from "next/router";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { SubMenu } from "@components/ui/common";

export default function App(props) {
  const router = useRouter();
  const {
    data: { events = [] },
    error,
  } = useGetEvents(props, "today");

  if (error) return <div>failed to load</div>;

  return (
    <>
      <Head>
        <title>Que fer avui a Cardedeu - Cultura Cardedeu</title>
        <meta
          name="description"
          content="Què fer avui a Cardedeu. Cultura Cardedeu és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a Cardedeu."
        />
        <link rel="canonical" href="https://www.culturacardedeu.com/" />
      </Head>
      <SubMenu />
      <div className="reset-this">
        <h1 className="mb-4 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Què fer avui a Cardedeu
        </h1>
      </div>
      <p className="mb-4 font-bold">
        Aprofita el teu temps i troba el que necessites: el millor del dia al
        teu abast.
      </p>
      <p className="mb-4">
        Les coses per fer a Cardedeu no descansen ni un dia.{" "}
        <a
          className="font-medium text-black underline"
          href="/setmana-a-cardedeu"
        >
          Cada setmana, descobrireu centenars d'activitats increïbles
        </a>{" "}
        per tots els racons del poble. Perquè us sigui més fàcil la tria, us
        ajudem a trobar el pla ideal per a vosaltres: cinema alternatiu,
        l'exposició imperdible, l'obra de teatre de la qual tothom parla,
        mercats, activitats familiars... Us oferim tota la informació per gaudir
        de Cardedeu i de la seva enorme activitat cultural. No cal moderació, la
        podeu gaudir a l'engròs.
      </p>
      <List events={events}>
        {(event) => <Card key={event.id} event={event} />}
      </List>
    </>
  );
}

export async function getStaticProps() {
  const { getCalendarEvents } = require("@lib/helpers");

  const from = new Date();
  from.setHours(8);
  from.setMinutes(0);
  const until = new Date();
  until.setHours(24);
  until.setMinutes(0);

  const { events } = await getCalendarEvents(from, until);
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: { events: normalizedEvents },
    revalidate: 60,
  };
}
