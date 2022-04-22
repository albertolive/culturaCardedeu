import { useGetEvent } from "@components/hooks/useGetEvent";

export default function Event(props) {
  const { data, error } = useGetEvent(props);
  console.log(data);
  if (error) return <div>failed to load</div>;

  return <div>hi</div>;
}

export async function getStaticPaths() {
  const { getCalendarEvents } = require("@lib/helpers");

  const now = new Date();
  const from = now;
  const until = new Date(now.getFullYear(), now.getMonth() + 1);

  const { events } = await getCalendarEvents(from, until);
  const eventsSlug = events.map((c) => ({ params: { eventId: c.slug } }));

  return {
    paths: eventsSlug,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { getCalendarEvent } = require("@lib/helpers");
  const eventId = params.eventId;
  const { event } = await getCalendarEvent(eventId);

  return {
    props: { event },
    revalidate: 10,
  };
}
