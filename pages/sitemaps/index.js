import Meta from "@components/partials/seo-meta";
import { getAllYears } from "@lib/dates";
import { MONTHS_URL as MONTHS } from "@utils/constants";
import Link from "next/link";

export default function Sitemaps() {
  const years = getAllYears();

  return (
    <>
      <Meta
        title={`Arxiu. Descobreix tot el que passa a Cardedeu - Cultura Cardedeu`}
        description="Descobreix tot el què ha passat a Cardedeu cada any. Les millors propostes culturals per esprémer al màxim de Cardedeu - Arxiu - Cultura Cardedeu"
        canonical="https://www.culturacardedeu.com/sitemaps"
      />
      <div className="grid overflow-hidden grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-2 grid-flow-row w-auto">
        {years.map((year) => (
          <div key={year} className="box">
            <div className="reset-this">
              <h2 className="pb-2">{year}</h2>
            </div>
            {MONTHS.map((month) => (
              <div key={`${year}-${month}`} className="box py-1">
                <Link
                  href={`/sitemaps/${year}/${month.toLocaleLowerCase()}`}
                  prefetch={false}
                >
                  <a className="hover:underline">
                    <p className="text-md capitalize">{month}</p>
                  </a>
                </Link>
              </div>
            )).reverse()}
          </div>
        ))}
      </div>
    </>
  );
}
