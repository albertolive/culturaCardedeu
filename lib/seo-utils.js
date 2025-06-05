// lib/seo-utils.js
// SEO utility functions for Cultura Cardedeu

const siteUrl =
  process.env.NEXT_PUBLIC_DOMAIN_URL || "https://www.culturacardedeu.com";

// Core SEO keywords for Cardedeu
export const CARDEDEU_SEO_KEYWORDS = {
  base: [
    "Cardedeu",
    "cultura Cardedeu",
    "esdeveniments Cardedeu",
    "plans Cardedeu",
    "activitats culturals Cardedeu",
    "agenda cultural Cardedeu",
    "que fer a Cardedeu",
    "cultura catalana",
    "Vallès Oriental",
  ],
  events: [
    "teatre Cardedeu",
    "música Cardedeu",
    "exposicions Cardedeu",
    "concerts Cardedeu",
    "festivals Cardedeu",
    "activitats familiars Cardedeu",
  ],
  news: [
    "notícies culturals",
    "resum setmanal",
    "agenda setmanal",
    "esdeveniments d'aquesta setmana",
    "millors plans Cardedeu",
  ],
  temporal: [
    "avui a Cardedeu",
    "cap de setmana a Cardedeu",
    "setmana a Cardedeu",
    "aquest mes a Cardedeu",
  ],
};

/**
 * Generate SEO-optimized title for news articles
 */
export const generateNewsSEOTitle = (baseTitle, dateRangeIgnored) => {
  let processedTitle = baseTitle.trim();

  // Ensure the title starts with a capital letter.
  // If "Els millors plans..." is desired, the input API title should be like that.
  // This will turn "millors plans..." into "Millors plans..."
  // And "els millors plans..." into "Els millors plans..."
  if (processedTitle.length > 0) {
    const firstWord = processedTitle.split(" ")[0];
    if (
      firstWord.toLowerCase() === "els" ||
      firstWord.toLowerCase() === "les" ||
      firstWord.toLowerCase() === "el" ||
      firstWord.toLowerCase() === "la" ||
      firstWord.toLowerCase() === "l'"
    ) {
      // Capitalize common articles if they start the title
      processedTitle =
        firstWord.charAt(0).toUpperCase() +
        firstWord.slice(1) +
        processedTitle.substring(firstWord.length);
    } else {
      // Otherwise, just capitalize the very first letter of the whole title
      processedTitle =
        processedTitle.charAt(0).toUpperCase() + processedTitle.slice(1);
    }
  }

  const siteName = "Cultura Cardedeu";
  const separator = " | ";
  const maxLength = 60;

  // Construct the full title candidate
  let finalTitle = `${processedTitle}${separator}${siteName}`;

  if (finalTitle.length > maxLength) {
    // If too long, calculate available length for the processedTitle part
    const siteNamePartLength = (separator + siteName).length;
    // No longer reserving space for ellipsis
    let availableLengthForTitle = maxLength - siteNamePartLength;

    // Ensure availableLengthForTitle is not impractically small
    if (availableLengthForTitle < 15) {
      // If space for title part is less than 15 chars
      // Option 1: Try to just show truncated processedTitle if it's very long
      if (processedTitle.length > maxLength) {
        // Check against full maxLength
        let truncatedContentOnly = processedTitle.substring(0, maxLength); // Truncate to maxLength
        const lastSpaceOnly = truncatedContentOnly.lastIndexOf(" ");
        if (
          lastSpaceOnly > Math.floor(maxLength * 0.5) && // Compare with maxLength
          lastSpaceOnly > 0
        ) {
          truncatedContentOnly = truncatedContentOnly.substring(
            0,
            lastSpaceOnly
          );
        }
        return truncatedContentOnly; // No ellipsis
      }
      // Option 2: If processedTitle itself is short enough (<=maxLength), return it as is.
      return processedTitle;
    }

    // Truncate processedTitle to fit with siteName
    if (processedTitle.length > availableLengthForTitle) {
      let truncatedContent = processedTitle.substring(
        0,
        availableLengthForTitle
      );
      const lastSpace = truncatedContent.lastIndexOf(" ");
      // Try to break at a word boundary, if it's a reasonable place to break
      if (
        lastSpace > Math.floor(availableLengthForTitle * 0.5) &&
        lastSpace > 0
      ) {
        truncatedContent = truncatedContent.substring(0, lastSpace);
      }
      finalTitle = `${truncatedContent}${separator}${siteName}`; // No ellipsis
    } else {
      // This case implies processedTitle fits with siteName (no truncation needed for processedTitle itself relative to availableLengthForTitle)
      // So, finalTitle should be constructed with the full processedTitle and siteName.
      // This path should be hit if `processedTitle.length <= availableLengthForTitle`,
      // meaning `processedTitle` itself does not need truncation to fit with `siteName` within `maxLength`.
      finalTitle = `${processedTitle}${separator}${siteName}`;
    }
  }
  return finalTitle;
};

/**
 * Generate SEO-optimized meta description for news articles
 */
export const generateNewsSEODescription = (content, events = []) => {
  if (!content)
    return "Descobreix els millors esdeveniments culturals de Cardedeu aquesta setmana.";

  // Strip HTML tags and clean the content first
  let cleanContent = content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();

  // Extract first meaningful paragraph
  let description = cleanContent.substring(0, 140);

  // Ensure it ends at a word boundary
  const lastSpaceIndex = description.lastIndexOf(" ");
  if (lastSpaceIndex > 100) {
    description = description.substring(0, lastSpaceIndex);
  }

  // Add location context if missing
  if (!description.toLowerCase().includes("cardedeu")) {
    description += ` | Cardedeu`;
  }

  // Add call to action if space allows
  if (description.length < 130) {
    description += ` | Descobreix més`;
  }

  return description.substring(0, 157) + "...";
};

/**
 * Generate keywords based on events and content
 */
export const generateDynamicKeywords = (events = [], customKeywords = []) => {
  const keywords = [
    ...CARDEDEU_SEO_KEYWORDS.base,
    ...CARDEDEU_SEO_KEYWORDS.news,
  ];

  // Add event-specific keywords
  events.forEach((event) => {
    if (event.title) {
      // Extract category keywords from event titles
      const title = event.title.toLowerCase();

      if (title.includes("teatre") || title.includes("obra")) {
        keywords.push("teatre Cardedeu");
      }
      if (title.includes("música") || title.includes("concert")) {
        keywords.push("música Cardedeu", "concerts Cardedeu");
      }
      if (title.includes("exposici") || title.includes("mostra")) {
        keywords.push("exposicions Cardedeu");
      }
      if (title.includes("famili") || title.includes("infant")) {
        keywords.push("activitats familiars Cardedeu");
      }
      if (title.includes("ball") || title.includes("dansa")) {
        keywords.push("dansa Cardedeu");
      }
    }
  });

  // Add custom keywords
  keywords.push(...customKeywords);

  // Remove duplicates and limit to 15 keywords
  return [...new Set(keywords)].slice(0, 15);
};

/**
 * Generate breadcrumb data for SEO
 */
export const generateBreadcrumbs = (pathSegments) => {
  const breadcrumbs = [{ name: "Inici", url: siteUrl }];

  let currentPath = "";
  pathSegments.forEach((segment) => {
    currentPath += `/${segment.slug}`;
    breadcrumbs.push({
      name: segment.name,
      url: `${siteUrl}${currentPath}`,
    });
  });

  return breadcrumbs;
};

/**
 * Extract events data from news content for structured data
 */
export const extractEventsFromContent = (events = []) => {
  return events.map((event) => ({
    name: event.title || event.summary,
    description: event.description?.substring(0, 200) || "",
    startDate: event.start?.dateTime || event.start?.date,
    endDate: event.end?.dateTime || event.end?.date,
    location: event.location || "Cardedeu",
    category: extractEventCategory(event.title || event.summary),
    image: event.image || null,
  }));
};

/**
 * Extract event category from title
 */
const extractEventCategory = (title) => {
  if (!title) return "Cultural";

  const titleLower = title.toLowerCase();

  if (titleLower.includes("teatre") || titleLower.includes("obra"))
    return "Teatre";
  if (titleLower.includes("música") || titleLower.includes("concert"))
    return "Música";
  if (titleLower.includes("exposici") || titleLower.includes("mostra"))
    return "Exposició";
  if (titleLower.includes("ball") || titleLower.includes("dansa"))
    return "Dansa";
  if (titleLower.includes("cinema") || titleLower.includes("pel·lícula"))
    return "Cinema";
  if (titleLower.includes("famili") || titleLower.includes("infant"))
    return "Familiar";
  if (titleLower.includes("literatura") || titleLower.includes("llibre"))
    return "Literatura";

  return "Cultural";
};

/**
 * Generate FAQ data for SEO (can be used in news articles)
 */
export const generateEventFAQs = (events = []) => {
  if (events.length === 0) return [];

  const faqs = [
    {
      question:
        "Quins esdeveniments culturals hi ha aquesta setmana a Cardedeu?",
      answer: `Aquesta setmana a Cardedeu hi ha ${
        events.length
      } esdeveniments culturals destacats: ${events
        .slice(0, 3)
        .map((e) => e.title)
        .join(", ")}.`,
    },
  ];

  // Add specific FAQs based on event types
  const hasTheater = events.some((e) =>
    e.title?.toLowerCase().includes("teatre")
  );
  const hasMusic = events.some(
    (e) =>
      e.title?.toLowerCase().includes("música") ||
      e.title?.toLowerCase().includes("concert")
  );
  const hasFamilyEvents = events.some((e) =>
    e.title?.toLowerCase().includes("famili")
  );

  if (hasTheater) {
    faqs.push({
      question: "Hi ha obres de teatre a Cardedeu aquesta setmana?",
      answer:
        "Sí, pots trobar representacions teatrals al Teatre Auditori de Cardedeu. Consulta l'agenda completa per a horaris i entrades.",
    });
  }

  if (hasMusic) {
    faqs.push({
      question: "Quin tipus de música puc escoltar a Cardedeu?",
      answer:
        "A Cardedeu organitzem concerts de diversos estils musicals, des de música clàssica fins a concerts de jazz, rock i música catalana.",
    });
  }

  if (hasFamilyEvents) {
    faqs.push({
      question: "Hi ha activitats per a famílies amb nens a Cardedeu?",
      answer:
        "Sí, oferim habitualment activitats culturals pensades per a tota la família, incloent espectacles infantils, tallers i activitats educatives.",
    });
  }

  return faqs;
};

/**
 * Generate Open Graph optimized content
 */
export const generateOGContent = (title, description, type = "article") => {
  return {
    title: title.length > 55 ? `${title.substring(0, 52)}...` : title,
    description:
      description.length > 155
        ? `${description.substring(0, 152)}...`
        : description,
    type,
    locale: "ca_ES",
    siteName: "Cultura Cardedeu",
  };
};

/**
 * Generate JSON-LD structured data for news articles
 */
export const generateNewsStructuredData = (newsData, events = []) => {
  const baseUrl = siteUrl;
  const structuredData = [];

  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": newsData.url,
    headline: newsData.title,
    description: newsData.description,
    image:
      newsData.image ||
      `${baseUrl}/static/images/banners/cultura-cardedeu-banner-0.jpeg`,
    author: {
      "@type": "Organization",
      name: "Cultura Cardedeu",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Cultura Cardedeu",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/static/images/logo-cultura-cardedeu.png`,
      },
    },
    datePublished: newsData.datePublished,
    dateModified: newsData.dateModified || newsData.datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": newsData.url,
    },
    articleSection: "Cultura",
    keywords: newsData.keywords,
    inLanguage: "ca",
    about: {
      "@type": "Thing",
      name: "Cultura i esdeveniments a Cardedeu",
    },
  };

  // Add events as mentions if available
  if (events.length > 0) {
    articleSchema.mentions = events.map((event) => ({
      "@type": "Event",
      name: event.name,
      startDate: event.startDate,
      location: {
        "@type": "Place",
        name: event.location || "Cardedeu",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cardedeu",
          addressRegion: "Catalunya",
          addressCountry: "ES",
        },
      },
    }));
  }

  structuredData.push(articleSchema);

  return structuredData;
};

/**
 * Optimize content for SEO
 */
export const optimizeContentForSEO = (content, targetKeywords = []) => {
  if (!content) return content;

  // Ensure target keywords appear naturally in content
  let optimizedContent = content;

  // Add location context if missing
  if (!optimizedContent.toLowerCase().includes("cardedeu")) {
    optimizedContent = optimizedContent.replace(
      /(\.|!|\?)(\s|$)/,
      "$1 Aquest esdeveniment tindrà lloc a Cardedeu.$2"
    );
  }

  return optimizedContent;
};

export default {
  generateNewsSEOTitle,
  generateNewsSEODescription,
  generateDynamicKeywords,
  generateBreadcrumbs,
  extractEventsFromContent,
  generateEventFAQs,
  generateOGContent,
  generateNewsStructuredData,
  optimizeContentForSEO,
  CARDEDEU_SEO_KEYWORDS,
};
