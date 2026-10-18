// Site-wide settings. Every value here is an example — replace them all when
// starting a new project. Used for SEO meta tags, structured data (JSON-LD),
// robots.txt, the web manifest, header and footer.
export const site = {
  // Production origin, no trailing slash. Also used as `site` in astro.config.mjs
  url: "https://example.com",

  // BCP 47 language tag for <html lang>, and the Open Graph locale
  lang: "en-GB",
  locale: "en_GB",

  info: {
    siteName: "Astro Starter",
    legalName: "Astro Starter Ltd",
    // Default meta description (~150–160 characters), used when a page has no `excerpt`
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Example site description used for search results and social sharing — replace me.",
    email: "hello@example.com",
    telephone: "+44 20 0000 0000",
    address: {
      streetAddress: "1 Example Street",
      addressLocality: "London",
      postalCode: "EC1A 1AA",
      addressCountry: "GB",
    },
    // Year the organisation was founded (structured data only)
    foundingDate: "2020",
  },

  seo: {
    // Title pattern: "%s" is replaced with the page title
    titleTemplate: "%s | Astro Starter",
    // Fallback social share image in /public, 1200×630
    defaultImage: "/og-default.png",
    defaultImageAlt: "Astro Starter — example social share image",
    // Organisation logo in /public (structured data), square, at least 112×112
    logo: "/apple-touch-icon.png",
    // X/Twitter handle including @, or "" to omit
    twitter: "@example",
    // Profile URLs linked to the organisation in structured data
    sameAs: [
      "https://www.linkedin.com/company/example",
      "https://www.instagram.com/example",
      "https://x.com/example",
    ],
  },

  // Browser UI colour and web manifest colours
  themeColor: "#111111",
  backgroundColor: "#ffffff",
};
