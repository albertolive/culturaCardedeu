import Image from "next/image";
import eventNotFound from "@public/static/images/error_404_page_not_found.png";
import Link from "next/link";

export default function NoEventFound() {
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="block blurred-image">
          <Image
            title="Esdeveniment no trobat - Cultura Cardedeu"
            src={eventNotFound}
            alt="Esdeveniment no trobat - Cultura Cardedeu"
            layout="intrinsic"
          />
        </div>
        <div className="flex flex-col h-full justify-center items-center text-center mx-4">
          <div className="reset-this">
            <h1>
              Ostres! L&apos;esdeveniment no existeix o ha estat cancel·lat pels
              organitzadors
            </h1>
          </div>
          <p className="mb-4">
            Pots provar sort amb el{" "}
            <Link href="/cerca">
              <a className="font-bold text-black hover:underline">cercador</a>
            </Link>
            , veure{" "}
            <Link href="/avui-a-cardedeu">
              <a className="font-bold text-black hover:underline">
                que passa avui a Cardedeu
              </a>
            </Link>
            , o bé,{" "}
            <Link href="/publica">
              <a className="font-bold text-black hover:underline">
                publicar l&apos;esdeveniment
              </a>
            </Link>
            . Si creus que hi ha un error, posa&apos;t en contacte amb nosaltres
            a:{" "}
            <a
              className="font-bold text-black hover:underline"
              href="mailto:hola@culturacardedeu.com"
            >
              hola@culturacardedeu.com
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
