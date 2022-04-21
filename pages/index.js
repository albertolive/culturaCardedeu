import React from "react";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { server } from "../config";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App(props) {
  const {
    data: { events = [] },
  } = useSWR("/api/getEvents", fetcher, {
    fallbackData: props,
    refreshInterval: 30000,
  });

  return (
    <List events={events}>
      {(event) => <Card key={event.id} event={event} />}
    </List>
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
    revalidate: 1,
  };
}

// export const getStaticProps2 = async () => {
//   try {
//     const res = await fetch(`${server}/api/getEvents`);
//     const events = await res.json();

//     if (!res.ok)
//       throw new Error(`Failed to fetch events, received status ${res.status}`);

//     return { props: { events }, revalidate: 10 };
//   } catch (err) {
//     console.error(err);
//     return { props: { error: JSON.parse(JSON.stringify(err)) } };
//   }
// };
