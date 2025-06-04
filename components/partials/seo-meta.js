import Head from "next/head";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

// SEO Keywords for Cardedeu
const CARDEDEU_KEYWORDS = [
  "Cardedeu",
  "cultura Cardedeu",
  "esdeveniments Cardedeu",
  "plans Cardedeu",
  "activitats culturals Cardedeu",
  "agenda cultural Cardedeu",
  "teatre Cardedeu",
  "música Cardedeu",
  "exposicions Cardedeu",
  "activitats familiars Cardedeu",
  "que fer a Cardedeu",
  "cultura catalana",
  "Vallès Oriental",
];

const getRandomImage = () => Math.floor(Math.random() * 9);

// Generate comprehensive structured data
const generateStructuredData = (props) => {
  const structuredData = [];

  // Base Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: "Cultura Cardedeu",
    url: siteUrl,
    logo: `${siteUrl}/static/images/logo-cultura-cardedeu.png`,
    description:
      "Portal cultural de Cardedeu amb agenda d'esdeveniments, activitats i notícies culturals",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cardedeu",
      addressRegion: "Catalunya",
      addressCountry: "ES",
    },
    areaServed: {
      "@type": "City",
      name: "Cardedeu",
    },
    sameAs: [
      "https://www.facebook.com/culturaCardedeu",
      "https://twitter.com/culturaCardedeu",
      "https://www.instagram.com/cultura_cardedeu",
    ],
  };
  structuredData.push(organizationSchema);

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: "Cultura Cardedeu",
    description:
      "Portal cultural de Cardedeu amb agenda d'esdeveniments, activitats i notícies culturals",
    publisher: {
      "@id": `${siteUrl}#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/cerca?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  structuredData.push(websiteSchema);

  // LocalBusiness Schema for Cardedeu cultural scene
  if (props.type !== "article") {
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${siteUrl}#localbusiness`,
      name: "Cultura Cardedeu",
      description:
        "Portal cultural de Cardedeu amb informació sobre esdeveniments, teatre, música, exposicions i activitats familiars",
      url: siteUrl,
      telephone: "+34-938-461-800",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Plaça de la Vila, 1",
        addressLocality: "Cardedeu",
        postalCode: "08440",
        addressRegion: "Catalunya",
        addressCountry: "ES",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 41.6419,
        longitude: 2.3508,
      },
      openingHours: "Mo-Fr 09:00-20:00, Sa-Su 10:00-18:00",
      areaServed: {
        "@type": "City",
        name: "Cardedeu",
      },
    };
    structuredData.push(localBusinessSchema);
  }

  // Enhanced NewsArticle Schema for Google News and news aggregators
  if (props.type === "article" && props.article) {
    const newsArticleSchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "@id": props.canonical,
      headline: props.title,
      description: props.description,
      image: [
        props.image ||
          `${siteUrl}/static/images/banners/cultura-cardedeu-banner-${getRandomImage()}.jpeg`,
      ],
      author: {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: "Cultura Cardedeu",
        url: siteUrl,
        logo: `${siteUrl}/static/images/logo-cultura-cardedeu.png`,
      },
      publisher: {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: "Cultura Cardedeu",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/static/images/logo-cultura-cardedeu.png`,
          width: 400,
          height: 400,
        },
      },
      datePublished: props.article.datePublished || new Date().toISOString(),
      dateModified: props.article.dateModified || new Date().toISOString(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": props.canonical,
      },
      // Google News specific fields
      articleSection: "Cultura",
      articleBody: props.description,
      wordCount: props.description?.length || 0,
      copyrightYear: new Date().getFullYear(),
      copyrightHolder: {
        "@id": `${siteUrl}#organization`,
      },
      license: `${siteUrl}/politica-privacitat`,
      isAccessibleForFree: true,
      inLanguage: "ca-ES",
      // Location-specific data for local news
      spatialCoverage: {
        "@type": "Place",
        name: "Cardedeu",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cardedeu",
          addressRegion: "Catalunya",
          addressCountry: "ES",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 41.6419,
          longitude: 2.3508,
        },
      },
      keywords: props.keywords || CARDEDEU_KEYWORDS.slice(0, 10).join(", "),
      about: [
        {
          "@type": "Thing",
          name: "Cultura",
          sameAs: "https://en.wikipedia.org/wiki/Culture",
        },
        {
          "@type": "Place",
          name: "Cardedeu",
          sameAs: "https://ca.wikipedia.org/wiki/Cardedeu",
        },
      ],
      // Events mentioned in the article
      mentions:
        props.article.events?.map((event) => ({
          "@type": "Event",
          name: event.name,
          startDate: event.startDate,
          location: {
            "@type": "Place",
            name: event.location || "Cardedeu",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Cardedeu",
              addressCountry: "ES",
            },
          },
        })) || [],
    };
    structuredData.push(newsArticleSchema);

    // Add separate BlogPosting schema for better coverage
    const blogPostSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${props.canonical}#blogpost`,
      headline: props.title,
      description: props.description,
      image: newsArticleSchema.image,
      author: newsArticleSchema.author,
      publisher: newsArticleSchema.publisher,
      datePublished: newsArticleSchema.datePublished,
      dateModified: newsArticleSchema.dateModified,
      mainEntityOfPage: newsArticleSchema.mainEntityOfPage,
      articleSection: "Notícies Culturals",
      keywords: newsArticleSchema.keywords,
      about: newsArticleSchema.about,
      mentions: newsArticleSchema.mentions,
    };
    structuredData.push(blogPostSchema);
  } else if (props.type === "article" && !props.article) {
    // Fallback BlogPosting for articles without full article data
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": props.canonical,
      headline: props.title,
      description: props.description,
      image:
        props.image ||
        `${siteUrl}/static/images/banners/cultura-cardedeu-banner-${getRandomImage()}.jpeg`,
      author: {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: "Cultura Cardedeu",
      },
      publisher: {
        "@id": `${siteUrl}#organization`,
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": props.canonical,
      },
      articleSection: "Cultura",
      keywords: props.keywords || CARDEDEU_KEYWORDS.slice(0, 10).join(", "),
      about: {
        "@type": "Thing",
        name: "Cultura Cardedeu",
      },
    };
    structuredData.push(articleSchema);
  }

  // Event Schema for events
  if (props.events && props.events.length > 0) {
    props.events.forEach((event) => {
      const eventSchema = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
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
        organizer: {
          "@id": `${siteUrl}#organization`,
        },
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        image:
          event.image ||
          `${siteUrl}/static/images/banners/cultura-cardedeu-banner-${getRandomImage()}.jpeg`,
      };
      structuredData.push(eventSchema);
    });
  }

  // Breadcrumb Schema
  if (props.breadcrumbs && props.breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: props.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
    structuredData.push(breadcrumbSchema);
  }

  // FAQ Schema
  if (props.faqs && props.faqs.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: props.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
    structuredData.push(faqSchema);
  }

  return structuredData;
};

// Generate optimized keywords
const generateKeywords = (props) => {
  const baseKeywords = [...CARDEDEU_KEYWORDS];

  if (props.customKeywords) {
    baseKeywords.push(...props.customKeywords);
  }

  if (props.type === "article") {
    baseKeywords.push(
      "notícies culturals",
      "resum setmanal",
      "agenda cultural"
    );
  }

  if (props.events) {
    const eventTypes = props.events.map((e) => e.category).filter(Boolean);
    baseKeywords.push(...eventTypes);
  }

  return baseKeywords.slice(0, 15).join(", ");
};

// Generate enhanced title with SEO optimization
const generateTitle = (props) => {
  if (props.seoTitle) return props.seoTitle;

  const baseTitle = props.title;
  const siteName = "Cultura Cardedeu";

  // For articles, optimize for news content
  if (props.type === "article") {
    return `${baseTitle} | Notícies Culturals ${siteName}`;
  }

  // For events pages
  if (props.type === "events") {
    return `${baseTitle} | Agenda Cultural ${siteName}`;
  }

  // Default format
  return baseTitle.includes(siteName)
    ? baseTitle
    : `${baseTitle} | ${siteName}`;
};

// Generate enhanced description with SEO optimization
const generateDescription = (props) => {
  if (props.seoDescription) return props.seoDescription;

  let description = props.description || "";

  // Ensure description is within optimal length
  if (description.length > 160) {
    description = description.substring(0, 157) + "...";
  }

  // Add location context if not present
  if (!description.toLowerCase().includes("cardedeu")) {
    description = `${description} Descobreix la cultura de Cardedeu.`.substring(
      0,
      160
    );
  }

  return description;
};

const Meta = (props) => {
  const image = props.imageUploaded
    ? props.imageUploaded
    : props.image
    ? siteUrl + props.image
    : `${siteUrl}/static/images/banners/cultura-cardedeu-banner-${getRandomImage()}.jpeg`;

  const structuredData = generateStructuredData(props);
  const optimizedTitle = generateTitle(props);
  const optimizedDescription = generateDescription(props);
  const keywords = generateKeywords(props);
  const canonical = props.canonical || `${siteUrl}${props.pathname || ""}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"
      />
      <meta
        name="robots"
        content={
          process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
            ? "noindex, nofollow"
            : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        }
      />

      {/* SEO Meta Tags */}
      <meta name="title" content={optimizedTitle} />
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Cultura Cardedeu" />
      <meta name="revisit-after" content="1 days" />

      {/* Language and Location */}
      <meta httpEquiv="content-language" content="ca" />
      <meta name="geo.region" content="ES-CT" />
      <meta name="geo.placename" content="Cardedeu" />
      <meta name="geo.position" content="41.6419;2.3508" />
      <meta name="ICBM" content="41.6419, 2.3508" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta
        property="og:type"
        content={props.type === "article" ? "article" : "website"}
      />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Cultura Cardedeu" />
      <meta property="og:locale" content="ca_ES" />
      <meta property="og:ttl" content="777600" />

      {/* Article specific OG tags */}
      {props.type === "article" && props.article && (
        <>
          <meta
            property="article:published_time"
            content={props.article.datePublished}
          />
          <meta
            property="article:modified_time"
            content={props.article.dateModified}
          />
          <meta property="article:author" content="Cultura Cardedeu" />
          <meta property="article:section" content="Cultura" />
          <meta property="article:publisher" content="Cultura Cardedeu" />
          {props.article.tags &&
            props.article.tags.map((tag) => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Google News specific meta tags */}
      {props.type === "article" && (
        <>
          <meta name="news_keywords" content={keywords} />
          <meta name="syndication-source" content={canonical} />
          <meta name="original-source" content={canonical} />
          <meta name="article:opinion" content="false" />
          <meta name="article:content_tier" content="free" />
          <meta name="article:content_warning" content="false" />
          <meta
            name="pubdate"
            content={props.article?.datePublished || new Date().toISOString()}
          />
          <meta
            name="lastmod"
            content={props.article?.dateModified || new Date().toISOString()}
          />
          {/* Location and language for Google News */}
          <meta name="geo.country" content="ES" />
          <meta name="geo.region" content="ES-CT" />
          <meta name="language" content="ca" />
          <meta name="coverage" content="local" />
          <meta name="distribution" content="global" />
          <meta name="rating" content="general" />
          <meta name="copyright" content="© 2024 Cultura Cardedeu" />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:site" content="@culturaCardedeu" />
      <meta name="twitter:creator" content="@culturaCardedeu" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:domain" content={siteUrl} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={optimizedTitle} />

      {/* Facebook */}
      <meta property="fb:app_id" content="103738478742219" />
      <meta property="fb:pages" content="103738478742219" />

      {/* Additional SEO Tags */}
      <meta
        name="google-site-verification"
        content="ujWqRwOYsTEmYofWVJcDeMp54QW4PGivj2yUaBRevls"
      />
      <meta name="msvalidate.01" content="" />
      <meta name="yandex-verification" content="" />

      {/* Favicons */}
      <link rel="icon" type="image/png" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* Preload important resources */}
      {props.preload && (
        <link
          rel="prefetch"
          href={props.preload}
          as="image"
          type="image/webp"
          crossOrigin="anonymous"
        />
      )}

      {/* Structured Data (JSON-LD) */}
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}
    </Head>
  );
};

export default Meta;
