import Head from "next/head";
import { Navbar, Footer } from "@components/ui/common";
import { Notify } from "@components/ui/common";

export default function BaseLayout({ children }) {
  return (
    <>
      <Head>
        <title>Cultura Cardedeu</title>
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
      {/* <Notify /> */}
      <div className="mx-auto pb-[85px]">
        <div className="fit max-w-7xl mx-auto p-4 xl:p-0 xl:py-4">
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
