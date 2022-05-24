import Head from "next/head";

const Meta = (props) => (
  <Head>
    <title>{props.title}</title>
    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow" />
    <meta name="title" content={props.title} />
    <meta name="description" content={props.description} />
    <link rel="canonical" href={`${props.canonical}`} />
    <meta property="og:type" content="article" />
    <meta name="og:title" property="og:title" content={props.title} />
    <meta
      name="og:description"
      property="og:description"
      content={props.description}
    />
    <meta property="og:image" content={props.image} />
    <meta property="og:url" content={props.canonical} />
    <meta property="og:site_name" content="Cultura Cardedeu" />
    <meta property="og:locale" content="ca_CT" />
    <meta name="language" content="Catalan" />
    <meta name="revisit-after" content="1 days" />
    <meta name="author" content="Cultura Cardedeu" />
    <meta name="news_keywords" content={props.newsKeywords} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={props.title} />
    <meta name="twitter:description" content={props.description} />
    <meta name="twitter:site" content="@culturaCardedeu" />
    <meta name="twitter:creator" content="Cultura Cardedeu" />
    <meta name="twitter:url" content={props.canonical} />
    <meta name="twitter:image:alt" content={props.title} />
    <meta property="fb:app_id" content="103738478742219" />
    <meta property="fb:pages" content="103738478742219" />
    <meta name="twitter:image" content={props.image} />
    <link rel="icon" type="image/png" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/favicon.ico" />
    <link rel="shortcut icon" href="/favicon.ico" />
    {props.preload && (
      <link
        rel="preload"
        href={props.preload}
        as="image"
        type="image/webp"
        crossOrigin
      />
    )}
  </Head>
);
export default Meta;
