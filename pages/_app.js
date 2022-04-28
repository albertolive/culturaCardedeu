import "@styles/globals.css";
import Script from "next/script";
import { BaseLayout } from "@components/ui/layout";

function CulturaCardedeuMainEntry({ Component, pageProps }) {
  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
        });
    `}
      </Script>

      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </>
  );
}

export default CulturaCardedeuMainEntry;
