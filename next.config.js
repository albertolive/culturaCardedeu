const { withSentryConfig } = require("@sentry/nextjs");

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  productionBrowserSourceMaps: true,
  i18n: {
    locales: ["ca-ES"],
    defaultLocale: "ca-ES",
  },
  reactStrictMode: false,
  images: {
    domains: [
      "impfr.tradedoubler.com",
      "connect.tradedoubler.com",
      "tarambana.cat",
      "cinemaesbarjo.cat",
      "www.cinemaesbarjo.cat",
      "https://www.cinemaesbarjo.cat/*",
      "https://www.cardedeu.cat",
      "http://www.teatreauditoricardedeu.cat",
      "www.ayrshare.com",
      "www.cardedeu.cat",
      "bibliotecacardedeu.cat",
      "www.bibliotecacardedeu.cat",
      "https://www.bibliotecacardedeu.cat/*",
      "https://www.bibliotecacardedeu.cat",
      "http://www.bibliotecacardedeu.cat",
      "www.bibliotecacardedeu.cat",
      "https://www.bibliotecacardedeu.cat/*",
      "res.cloudinary.com",
      "localhost",
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/agenda",
        destination: "/",
        permanent: true,
      },
      {
        source: "/publica-un-acte",
        destination: "/publica",
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(
  withSentryConfig(nextConfig, sentryWebpackPluginOptions)
);
