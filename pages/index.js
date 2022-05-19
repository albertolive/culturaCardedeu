import Head from "next/head";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { useGetEvents } from "@components/hooks/useGetEvents";

export default function App(props) {
  const {
    data: { events = [] },
    error,
  } = useGetEvents(props);

  if (error) return <div>failed to load</div>;

  return (
    <>
      <Head>
        <title>Agenda 2022 - Cultura Cardedeu</title>
        <meta
          name="description"
          content="Cultura Cardedeu és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a Cardedeu."
        />
        <link rel="canonical" href="https://www.culturacardedeu.com/" />
      </Head>
      <div className="reset-this">
        <h1 className="mb-4 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Agenda Cardedeu 2022
        </h1>
      </div>
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
