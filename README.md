# CulturaCardedeu

This is a Next.js website for cultural events in Cardedeu, powered by Google Calendar and enhanced with AI-generated content.

## Features

- **Event Management**: Google Calendar integration for event data
- **AI-Generated Content**:
  - Image analysis for event poster extraction (`/api/analyzeImage`)
  - Weekly news summaries with automated generation
- **Responsive Design**: Modern UI with Tailwind CSS
- **SEO Optimized**: Dynamic meta tags and sitemap generation

## Weekly News Feature

The site automatically generates weekly cultural news summaries using AI:

### How it works:

1. **Data Collection**: Fetches upcoming events from Google Calendar
2. **AI Generation**: Uses GitHub Models (GPT-4o) to create engaging summaries in Catalan
3. **Storage**: Saves summaries as events in a separate Google Calendar
4. **Display**: Shows summaries on `/noticies` page with individual article pages

### Setup:

#### 1. Environment Variables

```bash
# GitHub Models API (for AI generation)
GITHUB_TOKEN=your_github_token_here

# Google Calendar API
NEXT_PUBLIC_GOOGLE_CALENDAR=your_google_api_key
NEWS_CALENDAR_ID=your_news_calendar_id@group.calendar.google.com
NEXT_PUBLIC_NEWS_CALENDAR_ID=your_news_calendar_id@group.calendar.google.com

# Google Service Account (for calendar write access)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

#### 2. Google Calendar Setup

1. Create a new Google Calendar for news summaries
2. Create a Google Service Account with Calendar API access
3. Share both calendars (main events + news) with the service account email
4. Download the service account JSON key

#### 3. GitHub Secrets (for Actions)

Add these secrets to your GitHub repository:

- `GITHUB_TOKEN`: Your GitHub token with models access
- `NEWS_CALENDAR_ID`: Your news calendar ID
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Contents of your service account JSON file

#### 4. Manual Generation

To test locally:

```bash
npm run generate-news
```

### Scheduling

The GitHub Action runs every Monday at 6:00 AM UTC:

- File: `.github/workflows/generate-weekly-news.yml`
- Can be triggered manually via GitHub Actions UI

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## API Endpoints

- `/api/generateNewsSummary` - Generate weekly news summaries
- `/api/analyzeImage` - Analyze event posters with AI
- `/api/rss-news` - RSS feed for news summaries
- `/api/sitemap-news` - News sitemap for SEO
- Various calendar-related endpoints for events

## Environment Files

The project supports multiple environments:

- `.env.development`
- `.env.staging`
- `.env.production`

## Deployment

Deployed on Vercel with automatic deployments from the main branch.

## Technologies

- Next.js 12
- Tailwind CSS
- SWR for data fetching
- Google Calendar API
- GitHub Models (GPT-4o)
- Sentry for error tracking

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
