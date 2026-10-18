# Astro Starter

Starter for all Astro projects

## Tech Stack

- **Framework:** Astro 7 (static site generation) with MDX pages
- **Styling:** PostCSS with Figma-named design tokens and `postcss-custom-media` breakpoints
- **Smooth scroll:** Lenis (with custom anchor-link handling)
- **View transitions:** Astro `<ClientRouter>`

## Requirements

Node.js `>=26` (see `.nvmrc` — run `nvm use`)

## Setup

```bash
npm install
npm run dev
```

## Commands

| Command                  | Action                               |
| :----------------------- | :----------------------------------- |
| `npm run dev`            | Start dev server at `localhost:4321` |
| `npm run build`          | Build the site to `./dist/`          |
| `npm run preview`        | Preview the production build locally |
| `npx prettier --write .` | Format all files                     |

## Project Structure

TODO

## Pages & Navigation

Pages live in `src/pages/` as `.mdx` files. Navigation is generated from the file structure and frontmatter — there's no hand-written nav config.

```mdx
---
layout: ../layouts/Layout.astro # ../../layouts/… for pages in a subfolder
title: "Colour" # Page title and nav label
excerpt: "…" # Meta description, ~150–160 characters (falls back to site description)
order: 2 # Sort position in nav (default: 99)
group: "Visual Identity" # Optional: sub-heading this page sits under in the dropdown
hidden: true # Optional: exclude from navigation entirely
image: "/og-default.png" # Optional: social share image in /public, 1200×630
imageAlt: "…" # Optional: alt text for the share image
noindex: true # Optional: hide from search engines and the sitemap
---
```

Links use trailing slashes (`/page1/`) to match `trailingSlash: "always"` in `astro.config.mjs`.

## SEO

Every page gets a title, meta description, canonical URL, robots tag, Open Graph and X/Twitter tags, and JSON-LD structured data (Organization, WebSite, WebPage and BreadcrumbList). This is all rendered by `src/components/Seo.astro`. The build also generates `/sitemap-index.xml`, `/robots.txt` and `/site.webmanifest`.

### Replace when starting a new project

Everything below is example content:

- **`src/data/site.js`**: production URL, site name, legal name, description, contact details, address, social profiles, X handle, title template and theme colours. `astro.config.mjs` reads `site` from here.
- **`public/og-default.png`**: default social share image (1200×630).
- **`public/favicon.svg`, `favicon.ico`, `apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png`**: icons. The PNGs are also used as the organisation logo.
- **`src/pages/*.mdx`**: lorem ipsum copy, `title` and `excerpt` on every page.
- **`src/pages/404.astro`**: not-found copy.
- **`astro.config.mjs`**: `i18n` locales.

Each page should have one `# Heading` (the `<h1>`), followed by `##`/`###` in order. Use descriptive link text rather than "click here".

## Writing MDX pages

### MDX gotchas

- **Lines starting with `- `, `* `, `+ ` or `1. ` inside a multi-line tag become lists.** If Prettier wraps a line onto a leading dash, write it as `{"-"}`.
- **Don't put comments in the import block.** Any line between imports that isn't `import`/`export` ends the block and breaks the imports below. Use `{/* … */}` after the imports instead.

## CSS & Design Tokens

## Formatting & Linting

- **Prettier** with `prettier-plugin-astro`: `npx prettier --write .`
- **ESLint** with `eslint-plugin-astro`: config in `eslint.config.js` (not wired into the build). It has no TypeScript parser for `.astro` files, so TypeScript in component frontmatter (e.g. `interface Props`) shows a parsing warning in the editor — it doesn't affect the build.
