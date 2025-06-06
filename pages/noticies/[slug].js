import React from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import SeoMeta from "../../components/partials/seo-meta";
import { getNewsSummaries } from "../../lib/helpers";
import {
  generateBreadcrumbs,
  generateNewsSEOTitle,
  generateNewsSEODescription,
  generateDynamicKeywords,
  extractEventsFromContent,
  generateEventFAQs,
  generateNewsStructuredData,
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
function getArticleImageUrl(newsItem) {
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
  // Check if title contains explicit weekend indicators
  if (
    newsItem.title &&
    newsItem.title.toLowerCase().includes("cap de setmana")
  ) {
    return true;
  }

  // Fallback: check start day and duration using newsItem.startDate and newsItem.endDate
  if (newsItem.startDate && newsItem.endDate) {
    try {
      const parsedStartDate = new Date(newsItem.startDate);
      const parsedEndDate = new Date(newsItem.endDate);

      // Check if dates are valid
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        console.error(
          "Error processing dates in isWeekendSummary: Invalid date provided (startDate or endDate)"
        );
        return false;
      }

      const startDayOfWeek = parsedStartDate.getDay(); // Sunday = 0, ... , Saturday = 6
      // Calculate duration based on parsedStartDate and parsedEndDate
      const durationMs = parsedEndDate.getTime() - parsedStartDate.getTime();
      const daysDiff = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

      if (
        (startDayOfWeek === 5 || // Friday
          startDayOfWeek === 6 || // Saturday
          startDayOfWeek === 0) && // Sunday
        daysDiff >= 1 &&
        daysDiff <= 4 // Duration 1 to 4 days
      ) {
        return true;
      }
    } catch (e) {
      // This catch block can still catch errors from new Date() if format is totally unparseable,
      // or other unexpected errors.
      console.error(
        "Error processing dates in isWeekendSummary (fallback logic):",
        e
      );
    }
  }

  return false;
}

// Helper function to format the summary period in Catalan
function formatSummaryPeriod(newsItem) {
  const isWeekend = isWeekendSummary(newsItem);

  // If we have start and end dates, format the range
  if (newsItem.startDate && newsItem.endDate) {
    try {
      const startDateObj = new Date(newsItem.startDate);
      const endDateObj = new Date(newsItem.endDate);

      // Check if dates are valid
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        console.error(
          "Error processing dates in formatSummaryPeriod: Invalid date provided (startDate or endDate). Falling back."
        );
        // Allow to fall through to the next fallback mechanisms
      } else {
        // Adjust end date to be the last day of the period (assuming endDate is exclusive)
        const adjustedEndDate = new Date(endDateObj);
        adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);

        const startDay = startDateObj.getDate();
        const endDay = adjustedEndDate.getDate();
        // Ensure month and year are taken from the adjusted end date,
        // which correctly handles periods crossing month/year boundaries for the "X al Y de MONTH" part.
        const month = adjustedEndDate.getMonth();
        const year = adjustedEndDate.getFullYear();

        const monthName = MONTHS[month];
        const prefix = isWeekend ? "Cap de setmana del" : "Setmana del";

        // Handle single-day case for cleaner display (e.g. "del 6 de Juny" instead of "del 6 al 6 de Juny")
        // This requires checking if startDate and adjustedEndDate are the same day.
        if (
          startDateObj.getFullYear() === adjustedEndDate.getFullYear() &&
          startDateObj.getMonth() === adjustedEndDate.getMonth() &&
          startDay === endDay
        ) {
          return `${prefix} ${startDay} de ${monthName} de ${year}`;
        }

        return `${prefix} ${startDay} al ${endDay} de ${monthName} de ${year}`;
      }
    } catch (e) {
      console.error("Error processing dates in formatSummaryPeriod:", e);
      // Allow to fall through to the next fallback mechanisms
    }
  }

  // Fallback to original formattedStart if available
  if (newsItem.formattedStart) {
    const prefix = isWeekend ? "Cap de setmana del" : "Setmana del";
    return `${prefix} ${newsItem.formattedStart}`;
  }

  return isWeekend ? "Cap de setmana" : "Setmana";
}

export default function NoticiaPage({ newsItem, hasError, notFound }) {
  // Generate the slug for this news item (must be before any conditional returns)
  const slug = newsItem
    ? generateSlug(newsItem.title, newsItem.formattedStart)
    : "";

  // Handle 404 case
  if (notFound) {
    return (
      <>
        <SeoMeta
          title="Notícia no trobada - Cardedeu Cultural"
          description="La notícia que busques no existeix o ha estat eliminada."
          type="website"
        />
        <div className="container mx-auto">
          <div className="mx-auto">
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Notícia no trobada
                </h1>
                <p className="text-gray-600 mb-6">
                  La notícia que busques no existeix o ha estat eliminada.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link href="/noticies">
                    <a className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      ← Veure totes les notícies
                    </a>
                  </Link>
                  <Link href="/">
                    <a className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      Torna a l&apos;inici
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

  // Handle error case
  if (hasError) {
    return (
      <>
        <SeoMeta
          title="Error - Notícia Cultural"
          description="Hi ha hagut un error carregant la notícia."
        />
        <div className="container mx-auto">
          <div className="mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h1 className="text-xl font-semibold text-red-800 mb-2">
                Error carregant la notícia
              </h1>
              <p className="text-red-600 mb-4">
                Ho sentim, hi ha hagut un problema carregant aquesta notícia.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Tornar a intentar
                </button>
                <Link href="/noticies">
                  <a className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                    ← Torna a les notícies
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Generate SEO data for the article
  const breadcrumbs = generateBreadcrumbs([
    { name: "Notícies", slug: "noticies" },
    { name: newsItem.title, slug: slug },
  ]);

  const seoTitle = generateNewsSEOTitle(
    newsItem.title,
    newsItem.formattedStart || ""
  );
  const seoDescription = generateNewsSEODescription(newsItem.description);
  const keywords = generateDynamicKeywords([], [newsItem.title]);

  // Extract events for structured data (if available in the future)
  const events = extractEventsFromContent([]);
  const faqs = generateEventFAQs(events);

  const articleData = {
    datePublished: newsItem.start?.dateTime || new Date().toISOString(),
    dateModified: newsItem.updated || new Date().toISOString(),
    events: events,
    tags: [
      "cultura",
      "cardedeu",
      "esdeveniments",
      "notícies culturals",
      "vallès oriental",
    ],
  };

  // Generate JSON-LD structured data for this news item
  const newsData = {
    title: newsItem.title,
    description: stripHtmlAndClean(newsItem.description).substring(0, 200),
    url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/noticies/${slug}`,
    image: getArticleImageUrl(newsItem),
    datePublished: newsItem.start?.dateTime || new Date().toISOString(),
    dateModified:
      newsItem.updated || newsItem.start?.dateTime || new Date().toISOString(),
    keywords: [
      "cultura",
      "cardedeu",
      "esdeveniments",
      "notícies culturals",
      "vallès oriental",
      "agenda cultural",
      ...keywords,
    ],
  };

  const structuredData = generateNewsStructuredData(newsData, events);
  const jsonLdScript = JSON.stringify(structuredData[0]); // Get the main BlogPosting schema

  return (
    <>
      <SeoMeta
        seoTitle={seoTitle}
        description={seoDescription}
        type="article"
        article={articleData}
        image={newsItem.imageUploaded}
        breadcrumbs={breadcrumbs}
        customKeywords={keywords}
        faqs={faqs}
        pathname={`/noticies/${slug}`}
        canonical={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/noticies/${slug}`}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript }}
        />
      </Head>
      <div className="container mx-auto">
        <div className="mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/">
              <a className="hover:text-blue-600">Inici</a>
            </Link>
            <span>/</span>
            <Link href="/noticies">
              <a className="hover:text-blue-600">Notícies</a>
            </Link>
            <span>/</span>
            <span className="text-gray-900">{newsItem.title}</span>
          </nav>

          <article
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            itemScope
            itemType="https://schema.org/BlogPosting"
          >
            {/* Article Header */}
            <header className="bg-gray-800 px-8 py-8 border-b border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <time className="text-sm text-white font-medium">
                    {formatSummaryPeriod(newsItem)}
                  </time>
                </div>

                {/* Share button */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: newsItem.title,
                        text: newsItem.description?.substring(0, 200) + "...",
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="text-md text-[#ECB84A] hover:text-yellow-400 font-medium flex items-center space-x-1"
                >
                  <span>📤</span>
                  <span>Compartir</span>
                </button>
              </div>

              <h1
                className="text-3xl md:text-4xl font-bold text-white leading-tight"
                itemProp="headline"
              >
                {newsItem.title}
              </h1>
            </header>

            {/* Article Content */}
            <div className="px-8 py-8">
              <div className="prose prose-lg max-w-none">
                {newsItem.description ? (
                  <div
                    className="text-gray-700 leading-relaxed [&_a]:text-[#ECB84A] [&_a]:underline [&_a:hover]:text-yellow-400 [&_a]:font-medium"
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{
                      __html: newsItem.description,
                    }}
                  />
                ) : (
                  <p className="text-gray-600 italic">
                    No hi ha descripció disponible per aquest resum.
                  </p>
                )}
              </div>
            </div>

            {/* Article Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-gray-500">
                  Resum generat automàticament amb esdeveniments culturals de
                  Cardedeu
                </div>

                <div className="flex space-x-4">
                  <Link href="/noticies">
                    <a className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      ← Veure més notícies
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles / Call to Action */}
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
                    Veure esdeveniments d&apos;avui
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

// Generate static paths for all news articles
export async function getStaticPaths() {
  try {
    console.log("🔄 [noticies/[slug]] Generating static paths...");

    const { newsSummaries } = await getNewsSummaries({
      maxResults: 50, // Get more articles to generate paths for
    });

    const paths = (newsSummaries || []).map((newsItem) => {
      const slug = generateSlug(newsItem.title, newsItem.formattedStart);
      return {
        params: { slug },
      };
    });

    console.log("✅ [noticies/[slug]] Generated", paths.length, "static paths");

    return {
      paths,
      // Enable ISR - generate other pages on-demand
      fallback: "blocking",
    };
  } catch (error) {
    console.error("❌ [noticies/[slug]] Error generating static paths:", error);

    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

// Generate static props for each news article
export async function getStaticProps({ params }) {
  try {
    console.log(
      "🔄 [noticies/[slug]] Fetching news item for slug:",
      params.slug
    );

    const { newsSummaries } = await getNewsSummaries({
      maxResults: 50,
    });

    // Find the news item that matches the slug
    const newsItem = (newsSummaries || []).find((item) => {
      const itemSlug = generateSlug(item.title, item.formattedStart);
      return itemSlug === params.slug;
    });

    if (!newsItem) {
      console.log(
        "❌ [noticies/[slug]] News item not found for slug:",
        params.slug
      );
      return {
        notFound: true,
      };
    }

    console.log("✅ [noticies/[slug]] Found news item:", newsItem.title);

    return {
      props: {
        newsItem,
        hasError: false,
        notFound: false,
      },
      // Revalidate every hour to keep content fresh
      revalidate: 3600,
    };
  } catch (error) {
    console.error("❌ [noticies/[slug]] Error fetching news item:", error);

    return {
      props: {
        newsItem: null,
        hasError: true,
        notFound: false,
      },
      // Retry generation in 5 minutes if there was an error
      revalidate: 300,
    };
  }
}

// Helper function to generate slug (same as in index.js)
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
