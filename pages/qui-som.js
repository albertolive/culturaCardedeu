import Link from "next/link";
import Meta from "@components/partials/seo-meta";
import Image from "next/image";

export default function QuiSom() {
  return (
    <>
      <Meta
        title="Qui som - Cultura Cardedeu"
        description="Qui som? - Cultura Cardedeu és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a Cardedeu."
        canonical="https://www.culturacardedeu.com/qui-som"
      />
      <div className="relative py-16 bg-white overflow-hidden">
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div
            className="relative h-full text-lg max-w-prose mx-auto"
            aria-hidden="true"
          >
            <svg
              className="absolute top-12 left-full transform translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
              />
            </svg>
            <svg
              className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
              />
            </svg>
            <svg
              className="absolute bottom-12 left-full transform translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="d3eb07ae-5182-43e6-857d-35c643af9034"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
              />
            </svg>
          </div>
        </div>
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-[#ECB84A] font-semibold tracking-wide uppercase">
                Qui som?
              </span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Cultura Cardedeu
              </span>
            </h1>
            <p className="mt-8 prose prose-lg text-gray-500 leading-8">
              Cultura Cardedeu és una iniciativa ciutadana i sense ànim de lucre
              impulsada per Albert Olivé que té per objectiu facilitar
              l&apos;accés a la cultura a totes les persones de Cardedeu i
              rodalies. Ho fem agrupant tota la programació cultural perquè la
              tingueu a l&apos;abast d&apos;un cop d&apos;ull.
            </p>
          </div>
          <div className="mt-6 prose prose-lg text-gray-500 mx-auto">
            <p>
              Podeu ajudar-nos a actualitzar l&apos;agenda{" "}
              <Link href="/publica" prefetch={false}>
                <a className="font-medium text-black underline">penjant</a>
              </Link>{" "}
              vosaltres mateixos/es els actes que organitzeu i així, construirem
              aquesta pàgina web de forma col·laborativa!
            </p>
            <p className="mt-6 prose prose-lg text-gray-500 mx-auto">
              Podreu seguir l&apos;agenda cultural en aquesta pàgina web i/o:
            </p>
            <ul role="list">
              <div>
                <span>🐦 Twitter: </span>
                <a
                  className="text-[#ECB84A]"
                  href="https://twitter.com/CulturaCardedeu"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://twitter.com/CulturaCardedeu
                </a>
              </div>
              <div>
                <span>ғ Facebook: </span>
                <a
                  className="text-[#ECB84A]"
                  href="https://www.facebook.com/agendaculturacardedeu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://www.facebook.com/agendaculturacardedeu/
                </a>
              </div>
              <div>
                <span>ᴛ Telegram: </span>
                <a
                  className="text-[#ECB84A]"
                  href="https://t.me/culturacardedeu"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://t.me/culturacardedeu
                </a>
              </div>
              <div>
                <span>📷 Instagram: </span>
                <a
                  className="text-[#ECB84A]"
                  href="https://www.instagram.com/culturacardedeu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://www.instagram.com/culturacardedeu/
                </a>
              </div>
            </ul>
          </div>
          <div className="mt-6 prose prose-lg text-gray-500 mx-auto">
            <a href="https://www.ayrshare.com?utm_source=powered">
              <Image
                src="https://www.ayrshare.com/wp-content/uploads/ayrshare-badge.png"
                target="_blank"
                alt="Social Powered by Ayrshare"
                width="90px"
                height="30px"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
