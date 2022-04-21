import React from "react";
import { SWRConfig } from "swr";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { useCalendarEventsList } from "@components/hooks/useCalendarEventsList";

export default function App({ events }) {
  return (
    <List events={events}>
      {(event) => <Card key={event.id} event={event} />}
    </List>
  );
}

export const getServerSideProps = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/getEvents");
    const events = await res.json();

    return { props: { events } };
  } catch (err) {
    console.error(err);
    return { props: { error: JSON.parse(JSON.stringify(err)) } };
  }
};

// export async function getStaticProps(context) {
//   const { getCalendarEvents } = require("@lib/helpers");

//   const now = new Date();
//   const from = now;
//   const until = new Date(now.getFullYear(), now.getMonth() + 2);
//   const data = await getCalendarEvents(from, until);

//   return { props: { events: [] } };
// }
