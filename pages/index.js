import React from "react";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import { server } from "../config";

export default function App({ events = [] }) {
  console.log(events);
  return (
    <List events={events}>
      {(event) => <Card key={event.id} event={event} />}
    </List>
  );
}

export const getStaticProps = async () => {
  try {
    const res = await fetch(`${server}/api/getEvents`);
    const events = await res.json();

    return { props: { events }, revalidate: 60 };
  } catch (err) {
    console.error(err);
    return { props: { error: JSON.parse(JSON.stringify(err)) } };
  }
};
