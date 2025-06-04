import { getNewsSummaries } from "../../lib/helpers";

export default async function handler(req, res) {
  try {
    // Fetch recent news summaries (last 30 days for Google News)
    const { newsSummaries } = await getNewsSummaries({
      maxResults: 100,
    });

    const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

    // Filter news from last 30 days (Google News requirement)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentNews =
      newsSummaries?.filter((article) => {
        const articleDate = article.start?.dateTime
          ? new Date(article.start.dateTime)
          : new Date();
        return articleDate >= thirtyDaysAgo;
      }) || [];

    // Generate News Sitemap XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${recentNews
  .map((article) => {
    // Generate slug for the article URL
    const slug = generateSlug(article.title, article.formattedStart);
    const articleUrl = `${siteUrl}/noticies/${slug}`;

    // Format publication date (Google News format)
    const pubDate = article.start?.dateTime
      ? new Date(article.start.dateTime).toISOString()
      : new Date().toISOString();

    // Clean title for XML
    const cleanTitle = (article.title || "Notícia Cultural")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    // Clean description for XML
    const cleanDescription = (
      article.description || "Resum setmanal cultural de Cardedeu"
    )
      .substring(0, 200)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    return `  <url>
    <loc>${articleUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>Cultura Cardedeu</news:name>
        <news:language>ca</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${cleanTitle}</news:title>
      <news:keywords>cultura, cardedeu, esdeveniments, notícies locals, activitats culturals</news:keywords>
      <news:stock_tickers></news:stock_tickers>
    </news:news>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${siteUrl}/static/images/banners/cultura-cardedeu-banner-${Math.floor(
      Math.random() * 9
    )}.jpeg</image:loc>
      <image:caption>${cleanDescription}</image:caption>
      <image:title>${cleanTitle}</image:title>
    </image:image>
  </url>`;
  })
  .join("\n")}
</urlset>`;

    // Set proper headers
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=1800"
    );
    res.status(200).send(sitemapXml);
  } catch (error) {
    console.error("Error generating news sitemap:", error);
    res.status(500).json({ error: "Failed to generate news sitemap" });
  }
}

// Helper function to generate slug (same as used in news pages)
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
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);

  // Add date if available
  if (date) {
    const cleanDate = date.replace(/\D/g, "").substring(0, 8);
    return `${cleanTitle}-${cleanDate}`;
  }

  return cleanTitle;
}
