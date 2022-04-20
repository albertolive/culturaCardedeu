import "@styles/globals.css";
import { BaseLayout } from "@components/ui/layout";

function CulturaCardedeuMainEntry({ Component, pageProps }) {
  return (
    <BaseLayout>
      <Component {...pageProps} />
    </BaseLayout>
  );
}

export default CulturaCardedeuMainEntry;
