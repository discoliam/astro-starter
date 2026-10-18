// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import webmcp from "astro-webmcp";
import mdx from "@astrojs/mdx";
import { readdirSync, readFileSync } from "node:fs";
import { site } from "./src/data/site.js";

// Routes whose frontmatter sets `noindex: true` are left out of the sitemap
const noindexRoutes = readdirSync("./src/pages", { recursive: true })
  .map(String)
  .filter((file) => /\.(md|mdx)$/.test(file))
  .filter((file) =>
    /^---[\s\S]*?^noindex:\s*true\s*$[\s\S]*?^---/m.test(
      readFileSync(`./src/pages/${file}`, "utf8"),
    ),
  )
  .map((file) => {
    const path = file.replace(/\.(md|mdx)$/, "").replace(/(^|\/)index$/, "");
    return path ? `/${path}/` : "/";
  });

// https://astro.build/config
export default defineConfig({
  site: site.url,
  // URLs end in "/" everywhere (links, canonicals, sitemap) — avoids redirects on any static host
  trailingSlash: "always",
  i18n: {
    defaultLocale: "en-GB",
    locales: ["en-GB", "en"],
  },
  integrations: [
    sitemap({
      filter: (page) => !noindexRoutes.includes(new URL(page).pathname),
    }),
    webmcp(),
    mdx(),
  ],
});
