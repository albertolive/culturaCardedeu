import { getNewsSummaries } from "../../lib/helpers";

export default async function handler(req, res) {
  try {
    // Fetch recent news summaries
    const { newsSummaries } = await getNewsSummaries({
      maxResults: 50, // Include more items in RSS feed
    });

    const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
    const buildDate = new Date().toUTCString();

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
     xmlns:georss="http://www.georss.org/georss"
     xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Notícies Culturals - Cultura Cardedeu</title>
    <link>${siteUrl}/noticies</link>
    <description>Notícies culturals i resums setmanals de Cardedeu. Descobreix els millors esdeveniments, teatre, música i activitats familiars.</description>
    <language>ca-ES</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    <generator>Cultura Cardedeu News Feed</generator>
    <copyright>© 2024 Cultura Cardedeu</copyright>
    <managingEditor>info@culturacardedeu.com (Cultura Cardedeu)</managingEditor>
    <webMaster>info@culturacardedeu.com (Cultura Cardedeu)</webMaster>
    <category>Culture</category>
    <category>Local News</category>
    <category>Events</category>
    
    <!-- Google News specific elements -->
    <atom:link href="${siteUrl}/api/rss-news" rel="self" type="application/rss+xml" />
    
    <!-- Geographic information for Google News -->
    <georss:point>41.6419 2.3508</georss:point>
    <geo:lat>41.6419</geo:lat>
    <geo:long>2.3508</geo:long>
    
    <!-- Image for the feed -->
    <image>
      <url>${siteUrl}/static/images/logo-cultura-cardedeu.png</url>
      <title>Cultura Cardedeu</title>
      <link>${siteUrl}</link>
      <width>400</width>
      <height>400</height>
    </image>

${newsSummaries
  ?.map((article) => {
    // Generate slug for the article URL
    const slug = generateSlug(article.title, article.formattedStart);
    const articleUrl = `${siteUrl}/noticies/${slug}`;
    const pubDate = article.start?.dateTime
      ? new Date(article.start.dateTime).toUTCString()
      : new Date().toUTCString();

    // Clean and prepare description for RSS
    const description =
      article.description || "Resum setmanal cultural de Cardedeu";
    const cleanDescription = description
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    const cleanTitle = (article.title || "Notícia Cultural")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    return `    <item>
      <title>${cleanTitle}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${description}]]></description>
      <content:encoded><![CDATA[${description}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>Cultura Cardedeu</dc:creator>
      <category>Cultura</category>
      <category>Cardedeu</category>
      <category>Esdeveniments</category>
      
      <!-- Google News specific fields -->
      <georss:point>41.6419 2.3508</georss:point>
      <geo:lat>41.6419</geo:lat>
      <geo:long>2.3508</geo:long>
      
      <!-- Media content -->
      <media:content 
        url="${siteUrl}/static/images/banners/cultura-cardedeu-banner-${Math.floor(
      Math.random() * 9
    )}.jpeg"
        type="image/jpeg"
        medium="image">
        <media:title>${cleanTitle}</media:title>
        <media:description>${cleanDescription}</media:description>
      </media:content>
    </item>`;
  })
  .join("\n")}

  </channel>
</rss>`;

    // Set proper headers for RSS feed
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=1800"
    );
    res.status(200).send(rssXml);
  } catch (error) {
    console.error("Error generating news RSS feed:", error);
    res.status(500).json({ error: "Failed to generate RSS feed" });
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
