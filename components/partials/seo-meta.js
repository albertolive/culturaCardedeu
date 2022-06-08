import Head from "next/head";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

const getRandomImage = Math.floor(Math.random() * 9);

const Meta = (props) => {
  const image =
    props.image ||
    `/static/images/banners/cultura-cardedeu-banner-${getRandomImage}.jpeg`;

  return (
    <Head>
      <title>{props.title}</title>
      <meta charset="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta httpEquiv="Content-Language" content="ca" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="robots"
        content={
          process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
            ? "noindex, nofollow"
            : "index, follow"
        }
      />
      <meta name="title" content={props.title} />
      <meta name="description" content={props.description} />
      <link rel="canonical" href={`${props.canonical}`} />
      <meta property="og:ttl" content="777600" />
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={props.title} />
      <meta
        name="og:description"
        property="og:description"
        content={props.description}
      />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:url" content={props.canonical} />
      <meta property="og:site_name" content="Cultura Cardedeu" />
      <meta property="og:locale" content="ca-ES" />
      <meta name="revisit-after" content="1 days" />
      <meta name="author" content="Cultura Cardedeu" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:site" content="@culturaCardedeu" />
      <meta name="twitter:creator" content="Cultura Cardedeu" />
      <meta name="twitter:url" content={props.canonical} />
      <meta name="twitter:domain" content={siteUrl} />
      <meta name="twitter:image:alt" content={props.title} />
      <meta property="fb:app_id" content="103738478742219" />
      <meta property="fb:pages" content="103738478742219" />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
      <meta name="twitter:image:src" content={`${siteUrl}${image}`} />
      <link rel="icon" type="image/png" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" />
      {props.preload && (
        <link
          rel="preload"
          href={props.preload}
          as="image"
          type="image/webp"
          crossOrigin="true"
        />
      )}
    </Head>
  );
};
export default Meta;
