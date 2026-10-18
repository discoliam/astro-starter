// Generates /site.webmanifest from src/data/site.js
import { site } from "../data/site";

export function GET() {
  const manifest = {
    name: site.info.siteName,
    short_name: site.info.siteName,
    description: site.info.description,
    lang: site.lang,
    start_url: "/",
    display: "standalone",
    theme_color: site.themeColor,
    background_color: site.backgroundColor,
    icons: [
      { src: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
