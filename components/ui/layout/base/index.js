import Head from "next/head";
import { Navbar, Footer } from "@components/ui/common";

export default function BaseLayout({ children }) {
  return (
    <>
      <Head>
        <title>Cultura Cardedeu</title>
        <meta name="description" content="Cultura Cardedeu" />
        <link rel="icon" href="/favicon.ico" />
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
