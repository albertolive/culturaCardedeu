import React from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import SeoMeta from "../../components/partials/seo-meta";
import { getNewsSummaries } from "../../lib/helpers";
import {
  generateBreadcrumbs,
  generateDynamicKeywords,
  generateNewsStructuredData,
  CARDEDEU_SEO_KEYWORDS,
} from "../../lib/seo-utils";
import { MONTHS } from "../../utils/constants";

// Helper function to strip HTML tags for JSON-LD
function stripHtmlAndClean(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper function to get image URL for JSON-LD
function getImageUrl(newsItem) {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

  if (newsItem.imageUploaded) {
    return newsItem.imageUploaded.startsWith("http")
      ? newsItem.imageUploaded
      : `${baseUrl}${newsItem.imageUploaded.startsWith("/") ? "" : "/"}${
          newsItem.imageUploaded
        }`;
  }

  if (newsItem.images?.[0]) {
    const imagePath = newsItem.images[0];
    return imagePath.startsWith("http")
      ? imagePath
      : `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  }

  return `${baseUrl}/static/images/banners/cultura-cardedeu-banner-0.jpeg`;
}

// Helper function to detect if this is a weekend summary
function isWeekendSummary(newsItem) {
  // Check if title contains weekend indicators
  if (newsItem.title) {
    return newsItem.title.toLowerCase().includes("cap de setmana");
  }

  // Fallback: check date range duration
  if (newsItem.start?.dateTime && newsItem.end?.dateTime) {
    const startDate = new Date(newsItem.start.dateTime);
    const endDate = new Date(newsItem.end.dateTime);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return daysDiff <= 3; // Weekend summaries are typically 3 days or less
  }

  return false;
}

// Helper function to format the summary period in Catalan
function formatSummaryPeriod(newsItem) {
  const isWeekend = isWeekendSummary(newsItem);

  // If we have start and end dates, format the range
  if (newsItem.start?.dateTime && newsItem.end?.dateTime) {
    const startDate = new Date(newsItem.start.dateTime);
    const endDate = new Date(newsItem.end.dateTime);

    // Adjust end date to be the last day of the period
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);

    const startDay = startDate.getDate();
    const endDay = adjustedEndDate.getDate();
    const month = adjustedEndDate.getMonth();
    const year = adjustedEndDate.getFullYear();

    const monthName = MONTHS[month];
    const prefix = isWeekend ? "Cap de setmana del" : "Setmana del";

    return `${prefix} ${startDay} al ${endDay} de ${monthName} de ${year}`;
  }

  // Fallback to original formattedStart if available
  if (newsItem.formattedStart) {
    const prefix = isWeekend ? "Cap de setmana del" : "Setmana del";
    return `${prefix} ${newsItem.formattedStart}`;
  }

  return isWeekend ? "Cap de setmana" : "Setmana";
}

export default function NoticiesPage({ newsSummaries, hasError }) {
  // SEO optimization
  const breadcrumbs = generateBreadcrumbs([
    { name: "Notícies", slug: "noticies" },
  ]);

  const keywords = generateDynamicKeywords(
    [],
    [
      ...CARDEDEU_SEO_KEYWORDS.news,
      "portal cultural cardedeu",
      "informació cultural",
    ]
  );

  // Generate JSON-LD structured data for the news index page
  let jsonLdScript = null;
  if (!hasError && newsSummaries && newsSummaries.length > 0) {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

    // Generate JSON-LD for each news item
    const newsJsonLd = newsSummaries.map((newsItem, index) => {
      const slug = generateSlug(newsItem.title, newsItem.formattedStart);
      const newsUrl = `${baseUrl}/noticies/${slug}`;
      const cleanDescription = stripHtmlAndClean(newsItem.description);
      const imageUrl = getImageUrl(newsItem);

      // Create the news data object for structured data generation
      const newsData = {
        title: newsItem.title,
        description: cleanDescription.substring(0, 200),
        url: newsUrl,
        image: imageUrl,
        datePublished:
          newsItem.startDate ||
          newsItem.start?.dateTime ||
          new Date().toISOString(),
        dateModified:
          newsItem.updated ||
          newsItem.startDate ||
          newsItem.start?.dateTime ||
          new Date().toISOString(),
        keywords: [
          "cultura",
          "cardedeu",
          "esdeveniments",
          "notícies culturals",
          "vallès oriental",
          "agenda cultural",
        ],
      };

      // Generate structured data using existing utility
      const structuredData = generateNewsStructuredData(newsData, []);

      // Return the main article schema with position
      return {
        "@type": "ListItem",
        position: index + 1,
        item: structuredData[0], // Get the main BlogPosting schema
      };
    });

    // Create the main JSON-LD structure for the index page
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Notícies Culturals de Cardedeu",
      description:
        "Resums setmanals i de caps de setmana d'esdeveniments culturals, teatre, música i activitats familiars a Cardedeu",
      url: `${baseUrl}/noticies`,
      numberOfItems: newsSummaries.length,
      itemListElement: newsJsonLd,
      publisher: {
        "@type": "Organization",
        name: "Cultura Cardedeu",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/static/images/logo-cultura-cardedeu.png`,
        },
      },
      mainEntity: {
        "@type": "WebSite",
        name: "Cultura Cardedeu",
        url: baseUrl,
      },
    };

    jsonLdScript = JSON.stringify(jsonLd);
  }

  if (hasError) {
    return (
      <>
        <SeoMeta
          title="Error - Notícies Culturals"
          description="Hi ha hagut un error carregant les notícies."
        />
        <div className="container mx-auto">
          <div className="mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h1 className="text-xl font-semibold text-red-800 mb-2">
                Error carregant les notícies
              </h1>
              <p className="text-red-600">
                Ho sentim, hi ha hagut un problema carregant les notícies.
                Intenta-ho de nou més tard.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Tornar a intentar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SeoMeta
        title="Notícies Culturals Cardedeu - Portal Cultural Vallès Oriental"
        description="Notícies culturals i resums setmanals i de caps de setmana de Cardedeu. Descobreix els millors esdeveniments, teatre, música i activitats familiars cada setmana."
        type="website"
        breadcrumbs={breadcrumbs}
        customKeywords={keywords}
        pathname="/noticies"
      />
      {jsonLdScript && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdScript }}
          />
        </Head>
      )}
      <div className="container mx-auto">
        <div className="mx-auto">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center space-x-2 text-sm text-gray-600 mb-6"
            aria-label="Breadcrumb"
          >
            <Link href="/">
              <a className="hover:text-blue-600">Inici</a>
            </Link>
            <span>/</span>
            <span className="text-gray-900">Notícies Culturals</span>
          </nav>

          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Notícies Culturals de Cardedeu
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descobreix què passa cada setmana al món cultural de Cardedeu.
              Agenda d&apos;esdeveniments, teatre, música i activitats familiars
              al Vallès Oriental.
            </p>
          </header>

          {newsSummaries.length > 0 ? (
            <div className="space-y-8">
              {newsSummaries.map((newsItem, index) => {
                // Generate slug from title and date
                const slug = generateSlug(
                  newsItem.title,
                  newsItem.formattedStart
                );

                return (
                  <article
                    key={newsItem.id || index}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Article Header */}
                    <div className="bg-gray-800 text-white px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex-1">
                          <Link href={`/noticies/${slug}`}>
                            <a className="hover:text-blue-600 transition-colors">
                              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 hover:underline">
                                {newsItem.title}
                              </h2>
                            </a>
                          </Link>
                          <time className="text-sm text-white font-medium">
                            {formatSummaryPeriod(newsItem)}
                          </time>
                        </div>
                      </div>
                    </div>

                    {/* Article Preview */}
                    <div className="px-6 py-4">
                      <div className="flex flex-col md:flex-row gap-4 items-stretch">
                        <div className="flex-1 flex flex-col min-h-24 md:min-h-24">
                          <div className="text-gray-700 leading-relaxed mb-3">
                            {newsItem.description ? (
                              <div
                                className="line-clamp-3"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    newsItem.description.length > 200
                                      ? `${newsItem.description.substring(
                                          0,
                                          200
                                        )}...`
                                      : newsItem.description,
                                }}
                              />
                            ) : (
                              <p className="text-gray-500 italic">
                                No hi ha descripció disponible per aquest resum.
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-auto pb-1">
                            <Link href={`/noticies/${slug}`}>
                              <a className="inline-flex items-center text-[#ECB84A] hover:text-yellow-400 focus:outline-none font-medium text-md">
                                Llegir més
                                <svg
                                  className="ml-1 w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </a>
                            </Link>
                            <time className="text-xs text-gray-500">
                              {formatDateForDisplay(
                                newsItem.start?.dateTime ||
                                  new Date().toISOString()
                              )}
                            </time>
                          </div>
                        </div>

                        {newsItem.eventImage && (
                          <div className="flex-shrink-0">
                            <Image
                              src={newsItem.eventImage}
                              alt={newsItem.title || "Imatge de l'esdeveniment"}
                              width={128}
                              height={128}
                              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No hi ha notícies disponibles
                </h2>
                <p className="text-gray-600 mb-6">
                  Encara no tenim resums setmanals o de caps de setmana
                  disponibles. Torna aviat per descobrir les últimes notícies
                  culturals de Cardedeu.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link href="/avui-a-cardedeu">
                    <a className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Avui a Cardedeu
                    </a>
                  </Link>
                  <Link href="/setmana-a-cardedeu">
                    <a className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      Veure la setmana
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Descobreix més esdeveniments
              </h3>
              <p className="text-gray-600 mb-4">
                Explora tots els esdeveniments culturals que ofereix Cardedeu
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/avui-a-cardedeu">
                  <a className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Avui a Cardedeu
                  </a>
                </Link>
                <Link href="/setmana-a-cardedeu">
                  <a className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    Veure la setmana
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Server-side data fetching for better SEO
export async function getStaticProps() {
  try {
    const { newsSummaries, noEventsFound } = await getNewsSummaries({
      maxResults: 10,
    });

    return {
      props: {
        newsSummaries: newsSummaries || [],
        hasError: false,
      },
      // Revalidate every hour to keep content fresh
      revalidate: 3600,
    };
  } catch (error) {
    console.error("❌ [noticies/index] Error fetching news summaries:", error);

    return {
      props: {
        newsSummaries: [],
        hasError: true,
      },
      // Retry generation in 5 minutes if there was an error
      revalidate: 300,
    };
  }
}

// Helper function to generate slug (same as in [slug].js)
function generateSlug(title, date) {
  if (!title) return "noticia";

  // Clean title and convert to slug
  const cleanTitle = title
    .toLowerCase()
    .replace(/[àáâã]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõ]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  // If we have a date, add it for uniqueness
  if (date) {
    const dateSlug = date
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return `${cleanTitle}-${dateSlug}`.substring(0, 100); // Limit length
  }

  return cleanTitle.substring(0, 100);
}

function formatDateForDisplay(dateStr) {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ca-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}
