import Head from "next/head";
import { Navbar, Footer } from "@components/ui/common";

export default function BaseLayout({ children }) {
  console.log(process.env.VERCEL_ENV);
  console.log(process.env.NEXT_PUBLIC_VERCEL_ENV);
  return (
    <>
      <Head>
        <title>Cultura Cardedeu</title>
        <meta name="robots" content="noindex, nofollow"></meta>
        <meta name="description" content="Cultura Cardedeu" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="alternative"
          title="RSS Feed Cultura Cardedeu"
          type="application/rss+xml"
          href="/rss.xml"
        />
      </Head>
      <Navbar />
      <div className="mx-auto">
        <div className="max-w-7xl mx-auto fit p-4 xl:p-0 xl:py-4">
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
