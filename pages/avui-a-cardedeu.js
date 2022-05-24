import Link from "next/link";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { useGetEvents } from "@components/hooks/useGetEvents";
import { SubMenu } from "@components/ui/common";
import Meta from "@components/partials/seo-meta";

export default function App(props) {
  const {
    data: { events = [] },
    error,
  } = useGetEvents(props, "today");

  if (error) return <div>failed to load</div>;

  return (
    <>
      <Meta
        title="Que fer avui a Cardedeu - Cultura Cardedeu"
        description="Què fer avui a Cardedeu. Us oferim tota la informació per gaudir de Cardedeu i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar."
        canonical="https://www.culturacardedeu.com/avui-a-cardedeu"
        image="/static/images/logo-cultura-cardedeu.png"
        newsKeywords="Què fer avui a Cardedeu. Aprofita el teu temps i troba el que necessites: el millor del dia al teu abast."
      />
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
        <Link href="/setmana-a-cardedeu">
          <a className="font-medium text-black underline">
            Cada setmana, descobrireu centenars d&apos;activitats increïbles
          </a>
        </Link>{" "}
        per tots els racons del poble. Perquè us sigui més fàcil la tria, us
        ajudem a trobar el pla ideal per a vosaltres: cinema alternatiu,
        l&apos;exposició imperdible, l&apos;obra de teatre de la qual tothom
        parla, mercats, activitats familiars... Us oferim tota la informació per
        gaudir de Cardedeu i de la seva enorme activitat cultural. No cal
        moderació, la podeu gaudir a l&apos;engròs.
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
