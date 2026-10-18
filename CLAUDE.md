# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also [AGENTS.md](AGENTS.md) (dev-server and Astro docs links).

## Commands

- `astro dev --background` — start the dev server in the background (manage with `astro dev stop|status|logs`). `npm run dev` runs it in the foreground at `localhost:4321`.
- `npm run build` — static build to `./dist/`
- `npm run preview` — serve the production build
- `npx prettier --write .` — format (uses `prettier-plugin-astro`)
- `npx eslint .` — lint with `eslint-plugin-astro` (not wired into the build; TS in `.astro` frontmatter shows parser warnings, which are harmless)

There is no test suite. Node `>=26` (`.nvmrc`, `package.json` engines).

## Architecture

Static Astro 7 site, pages written as MDX. Integrations: `@astrojs/mdx`, `@astrojs/sitemap`, `astro-webmcp`. i18n is configured (`en-GB` default) but no localized routes exist yet. `site` in `astro.config.mjs` is still the placeholder `https://example.com`.

### Pages and navigation

- Pages are `.mdx` files in `src/pages/` that set `layout:` in frontmatter, usually `../layouts/ContainedLayout.astro` (wraps content in `.Container` and forwards `frontmatter` to `Layout.astro`). Wrapper layouts must forward the whole `frontmatter` object, not individual fields, or SEO fields like `image`/`noindex` are lost. MDX passes frontmatter to the layout as `Astro.props.frontmatter`; `.astro` pages (e.g. `404.astro`) pass props directly. `Layout.astro` handles both.
- URLs always end in `/` (`trailingSlash: "always"`). Navigation items have `url` (no slash, used as the tree key) and `href` (with slash, used in links). Hand-written internal links should include the trailing slash.
- Navigation has no config — it's derived from the file tree. `src/utils/navigation.js` uses `import.meta.glob("../pages/**/*.{astro,md,mdx}", { eager: true })` to read every page's frontmatter, then builds menus:
  - `getFullMenu()` → nested tree (mobile `Menu.astro`)
  - `getTopMenu()` → tree truncated to one level of children (desktop nav in `Header.astro`)
  - `getNavigation(pathname)` → current/parent/siblings/children for a URL
- Frontmatter fields read by navigation: `title` (nav label), `order` (sort, default 99), `group` (sub-heading in a dropdown — `NavItem.astro` groups children by it), `hidden` (exclude from nav). 404 pages are excluded.
- Nesting is by directory: `src/pages/foo/index.mdx` is the parent of `src/pages/foo/bar.mdx`. `NavItem.astro` renders recursively via `Astro.self`.

### SEO

- `src/components/Seo.astro` renders all head meta: title (via `site.seo.titleTemplate`, site name only on the home page), description, canonical (omitted when `noindex`), robots, Open Graph/X tags, icons, manifest and a JSON-LD `@graph` (Organization, WebSite, WebPage, BreadcrumbList built from the page tree).
- Page frontmatter for SEO: `title`, `excerpt` (meta description), optional `image`/`imageAlt` (share image in `public/`), `noindex`. Anything missing falls back to `src/data/site.js`.
- `src/data/site.js` is the single source for site URL, name, description, contact/address, social links and colours. `astro.config.mjs` imports `site.url` from it, and scans `src/pages` frontmatter for `noindex: true` to exclude those routes from the sitemap.
- `src/pages/robots.txt.js` and `src/pages/site.webmanifest.js` are static endpoints generated from that config.
- All values in `site.js`, the page copy and the images in `public/` are placeholders, so keep them obviously "example" in this starter.

### Client-side behaviour and view transitions

`Layout.astro` uses `<ClientRouter />` (view transitions), so inline scripts must re-initialise on `astro:page-load` (see the `initMenu` pattern in `Header.astro`). `SmoothScroll.astro` (Lenis) is `transition:persist`ed and keeps a single Lenis instance across navigations; it intercepts same-page `#anchor` clicks in the capture phase so Lenis, not the browser/router, does the scroll, and resets scroll on `astro:after-swap`.

### CSS

- Global CSS entry is `src/css/style.css`, imported by `Layout.astro`, which `@import`s `global/*`, `partials/*` and Lenis styles (resolved by `postcss-import`).
- PostCSS (`postcss.config.cjs`): `postcss-import` → `@csstools/postcss-global-data` (injects `src/css/global/queries.css` everywhere) → `postcss-custom-media` → `postcss-preset-env` stage 1 (native nesting, etc.).
- Breakpoints are custom media queries usable in any file, including component `<style>` blocks: `--mq-mobile-and-up` (440), `--mq-tablet-and-up` (768), `--mq-netbook-and-up` (1194), `--mq-desktop-and-up` (1440).
- All design tokens live in `src/css/global/settings.css`: Figma-style scale tokens (`--Spacing-x4`, `--Type-Display-L`, `--Template-*`, mobile-first, overridden per breakpoint) plus project aliases (`--palette-*`, `--header-height`, `--global-transition`, etc.). Colours should come from the `--palette-*` aliases; don't introduce variables that aren't defined there.
- Class naming is BEM-ish PascalCase: `Block`, `Block__Element`, `Block--modifier` (e.g. `NavItem__Link--active`).

### Other

- `src/utils/build-date.js` exports one `Date` evaluated at build time, shared by all pages (footer "Updated" stamp).
- Path aliases in `jsconfig.json`: `@components/*`, `@utils/*`, `@lib/*` (no `src/lib` yet); existing code uses relative imports.

## MDX gotchas (from README)

- Inside a multi-line JSX tag, lines starting with `- `, `* `, `+ ` or `1. ` become lists; write a leading dash as `{"-"}`.
- Don't put comments between `import` lines in MDX — it ends the import block. Use `{/* … */}` after the imports.
