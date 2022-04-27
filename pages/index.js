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
        <meta name="description" content="Agenda 2022 - Cultura Cardedeu" />
      </Head>

      <List events={events}>
        {(event) => <Card key={event.id} event={event} />}
      </List>
    </>
  );
}

export async function getStaticProps() {
  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = now;
  const until = new Date(now.getFullYear(), now.getMonth() + 1);

  const { events } = await getCalendarEvents(from, until);
  const normalizedEvents = JSON.parse(JSON.stringify(events));

  return {
    props: { events: normalizedEvents },
    revalidate: 60,
  };
}
