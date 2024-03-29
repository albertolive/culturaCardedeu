// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === "production") {
  const SENTRY_DSN =
    process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

  Sentry.init({
    dsn:
      SENTRY_DSN ||
      "https://a0060cc970374b0bbda6e33ef349beff@o1305941.ingest.sentry.io/6547894",
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV,
    enabled: process.env.NODE_ENV !== "development",
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  });
}
