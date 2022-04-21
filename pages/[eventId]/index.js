export default function Event(props) {
  console.log(props);
  return <div>hi</div>;
}

export function getStaticPaths() {
  return {
    paths: [{ params: { eventId: "test" } }],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const eventId = context.params.eventId;

  return {
    props: {
      eventId,
    },
    // revalidate: 10,
  };
}
