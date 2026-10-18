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

```text
public/                 Static files served as-is: favicons, app icons, default share image
src/
├── components/
│   ├── Header.astro        Site header, desktop nav and mobile slide-in menu
│   ├── Menu.astro          Full nested menu (used in the mobile nav)
│   ├── NavItem.astro       Recursive nav item; groups children by `group` frontmatter
│   ├── Footer.astro        Footer with site name, build timestamp and legal line
│   ├── Seo.astro           All <head> SEO tags and JSON-LD structured data
│   └── SmoothScroll.astro  Lenis smooth scroll, persisted across view transitions
├── css/
│   ├── style.css           Entry point: imports everything below
│   ├── global/             Reset, design tokens (settings.css), breakpoints, base styles
│   └── partials/           Container, block and animation helpers
├── data/site.js        Site-wide settings: URL, name, description, contact, social, colours
├── layouts/
│   ├── Layout.astro          Base HTML document: <head>, header, main, footer
│   └── ContainedLayout.astro Layout with content wrapped in a centred `.Container`
├── pages/
│   ├── *.mdx               Content pages: routes and navigation come from these
│   ├── 404.astro           Not-found page (noindex)
│   ├── robots.txt.js       Generates /robots.txt
│   └── site.webmanifest.js Generates /site.webmanifest
└── utils/
    ├── navigation.js       Builds menus, breadcrumbs and page relationships from src/pages
    ├── build-date.js       Single build timestamp shared by every page
    └── helpers.js          slugify, cleanName, formatBytes
```

### Layouts

- **`ContainedLayout.astro`**: the default for content pages. It wraps the page in `.Container`, which is full width minus the page margin on mobile and centred at `--max-width` from tablet up.
- **`Layout.astro`**: full-bleed. Use it directly for pages that manage their own containers.

Both layouts accept the same frontmatter. MDX pages pass it as `frontmatter`; `.astro` pages pass it as props, e.g. `<Layout title="…" description="…" noindex>`.

## Pages & Navigation

Pages live in `src/pages/` as `.mdx` files. Navigation is generated from the file structure and frontmatter — there's no hand-written nav config.

```mdx
---
layout: ../layouts/ContainedLayout.astro # ../../layouts/… for pages in a subfolder
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

All CSS goes through PostCSS (`postcss.config.cjs`): `postcss-import`, then `postcss-custom-media`, then `postcss-preset-env` (stage 1). Native nesting works everywhere, including component `<style>` blocks.

- **Entry point:** `src/css/style.css` is imported once by `Layout.astro`. Add new global files there.
- **Tokens:** `src/css/global/settings.css` holds every custom property. Don't use a variable that isn't defined there.
  - *Figma scale* (mobile-first, overridden at tablet and desktop): `--Spacing-x1`…`--Spacing-x24`, `--Type-Display-*`, `--Type-Paragraph-*`, `--Template-*` (page width, margin, columns, gutter), `--Primary-Font`/`--Secondary-Font`.
  - *Project aliases*: `--palette-light|mid|dark|action|hover` plus success/error/warning, `--max-width`, `--gap`, `--page-padding`, `--header-height`, `--border`, `--global-transition`, aspect ratios (`--ar-*`).
  - Use the `--palette-*` aliases for colour, and change the values in `settings.css` per project.
- **Breakpoints:** custom media from `src/css/global/queries.css`, available in any file:

  | Query                 | Min width |
  | :-------------------- | :-------- |
  | `--mq-mobile-and-up`  | 440px     |
  | `--mq-tablet-and-up`  | 768px     |
  | `--mq-netbook-and-up` | 1194px    |
  | `--mq-desktop-and-up` | 1440px    |

  ```css
  .Thing {
    padding: var(--Spacing-x4);
    @media (--mq-tablet-and-up) {
      padding: var(--Spacing-x8);
    }
  }
  ```

- **Layout helpers:** `.Container` (page-width wrapper), `.Grid` (1 column on mobile, 12 from tablet; `.Grid--two-cols`, `.Grid--thirds`).
- **Type helpers:** `.h1`–`.h6` style any element like a heading; also `.p-l`, `.p-m`, `.p-s`, `.p-xs`.
- **Naming:** BEM-style PascalCase: `Block`, `Block__Element`, `Block--modifier`.

## Formatting & Linting

- **Prettier** with `prettier-plugin-astro`: `npx prettier --write .`
- **ESLint** with `eslint-plugin-astro`: config in `eslint.config.js` (not wired into the build). It has no TypeScript parser for `.astro` files, so TypeScript in component frontmatter (e.g. `interface Props`) shows a parsing warning in the editor — it doesn't affect the build.
