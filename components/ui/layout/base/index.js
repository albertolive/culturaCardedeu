import dynamic from "next/dynamic";
import Head from "next/head";

const Navbar = dynamic(() => import("@components/ui/common/navbar"), {
  loading: () => "",
});

const Footer = dynamic(() => import("@components/ui/common/footer"), {
  loading: () => "",
});

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
        <link
          rel="alternative"
          title="RSS Feed Notícies Culturals"
          type="application/rss+xml"
          href="/api/rss-news"
        />
      </Head>
      <Navbar />
      <div className="mx-auto pb-[85px]">
        <div className="fit max-w-7xl mx-auto p-4 xl:p-0 xl:py-4">
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
