import { getNewsSummaries } from "../../lib/helpers";

export default async function handler(req, res) {
  try {
    // Fetch recent news summaries
    const { newsSummaries, noEventsFound } = await getNewsSummaries({
      maxResults: 100, // Google News sitemap limit is 1,000 URLs
    });

    if (noEventsFound || !newsSummaries || newsSummaries.length === 0) {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res
        .status(200)
        .send(
          '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"></urlset>'
        );
      return;
    }

    const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

    // Filter news (Google News typically processes articles from the last 2 days, but sitemap can contain more)
    // Let's keep a reasonable window, e.g., last 30 days, to ensure recent content is available.
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentNews =
      newsSummaries?.filter((article) => {
        const articleDate = article.start?.dateTime
          ? new Date(article.start.dateTime)
          : new Date(article.publicationDate || article.date || Date.now()); // Use available date field
        return articleDate >= thirtyDaysAgo;
      }) || [];

    // Generate News Sitemap XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${recentNews
  .map((article) => {
    // CRITICAL: Use article.slug if it's the source of truth for your news article URLs.
    // Ensure article.slug is populated correctly by getNewsSummaries/normalizeEvent.
    const articleUrl = `${siteUrl}/noticies/${article.slug}`; // Assumes /noticies/ is the correct path

    const pubDate = article.start?.dateTime
      ? new Date(article.start.dateTime).toISOString()
      : new Date(
          article.publicationDate || article.date || Date.now()
        ).toISOString();

    const cleanTitle = (article.title || "Notícia Cultural")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    // Use article description or a snippet for image caption
    const imageCaption = (
      article.description || "Resum setmanal cultural de Cardedeu"
    )
      .replace(/<[^>]*>/g, "") // Strip HTML tags
      .substring(0, 200) // Ensure it's a snippet
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    // Prioritize article-specific image
    let imageUrl = `${siteUrl}/static/images/logo-cultura-cardedeu.png`; // Default fallback
    if (article.imageUploaded) {
      imageUrl = article.imageUploaded.startsWith("http")
        ? article.imageUploaded
        : `${siteUrl}${article.imageUploaded.startsWith("/") ? "" : "/"}${
            article.imageUploaded
          }`;
    } else if (
      article.images &&
      article.images.length > 0 &&
      article.images[0]
    ) {
      const imgPath = article.images[0];
      imageUrl = imgPath.startsWith("http")
        ? imgPath
        : `${siteUrl}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
    }

    // Optional: Dynamic keywords from article tags if available
    const keywords = (
      article.tags && Array.isArray(article.tags)
        ? article.tags.join(", ")
        : "cultura, cardedeu, notícies"
    )
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return `  <url>
    <loc>${articleUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>Cultura Cardedeu</news:name>
        <news:language>ca</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${cleanTitle}</news:title>
      <news:keywords>${keywords}</news:keywords>
      <news:stock_tickers></news:stock_tickers>
    </news:news>
    <changefreq>daily</changefreq> <!-- More appropriate for news -->
    <priority>0.9</priority> <!-- News is often high priority -->
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:caption>${imageCaption}</image:caption>
      <image:title>${cleanTitle}</image:title>
    </image:image>
  </url>`;
  })
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=1800, stale-while-revalidate=900" // Shorter cache for news sitemap
    );
    res.status(200).send(sitemapXml);
  } catch (error) {
    console.error("Error generating news sitemap:", error);
    Sentry.captureException(error); // Assuming Sentry is configured
    res.status(500).send("Error generating news sitemap"); // Send plain text or simple XML error
  }
}

// The local generateSlug function is no longer needed if article.slug is used.
// If article.slug is NOT available, you MUST ensure this function is present and correct:
/*
function generateSlug(title, date) {
  if (!title) return "noticia";
  const cleanTitle = title
    .toLowerCase()
    .replace(/[àáâã]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõ]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
  if (date) {
    const cleanDate = date.replace(/\D/g, "").substring(0, 8);
    return `${cleanTitle}-${cleanDate}`;
  }
  return cleanTitle;
}
*/
