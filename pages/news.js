// pages/news.js
import React from 'react';
import Head from 'next/head'; // Used by SeoMeta, but good to have for direct use if needed
import BaseLayout from '../components/ui/layout/base'; // Adjusted path
import SeoMeta from '../components/partials/seo-meta'; // Adjusted path
import { useNewsSummary } from '../components/hooks/useNewsSummary'; // To be created

export default function NewsPage() {
  const { data, error, isLoading } = useNewsSummary(); // This hook will fetch from /api/news

  if (isLoading) return <BaseLayout><div className="container mx-auto px-4 py-8"><p>Loading news...</p></div></BaseLayout>;
  if (error) return <BaseLayout><div className="container mx-auto px-4 py-8"><p>Error loading news: {error.message}</p></div></BaseLayout>;

  // Assuming data structure is { newsSummaries: [], noEventsFound: boolean }
  const newsItem = data && data.newsSummaries && data.newsSummaries.length > 0
    ? data.newsSummaries[0]
    : null;

  return (
    <BaseLayout>
      <SeoMeta
        title="Weekly News - Cardedeu Cultural"
        description="The latest cultural news and summaries for Cardedeu."
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Notícies Culturals Setmanals</h1>
        {newsItem ? (
          <article className="prose lg:prose-xl max-w-none">
            {/*
              The newsItem comes from normalizeEvent.
              The generateNewsSummary.js script puts the AI-generated "title" into the Google Calendar event's "summary" field.
              And the AI-generated "summary paragraph" into the Google Calendar event's "description" field.
              So, newsItem.summary should be the title, and newsItem.description the body.
            */}
            <h2 className="text-2xl font-semibold mt-4 mb-2">{newsItem.summary}</h2>
            <div dangerouslySetInnerHTML={{ __html: newsItem.description }} />
            {/*
              If newsItem.description is guaranteed plain text (OpenAI prompt asked for plain text),
              then <p>{newsItem.description}</p> would be safer.
              However, calendar event descriptions can sometimes have basic HTML (like newlines as <br>).
              Using dangerouslySetInnerHTML is fine if the source (our AI summary) is trusted.
            */}
          </article>
        ) : (
          <p className="text-center">No hi ha notícies disponibles actualment. Torna a intentar-ho més tard!</p>
        )}
      </div>
    </BaseLayout>
  );
}
