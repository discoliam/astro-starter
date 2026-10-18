/**
 * Core Data Fetcher
 */
export async function getNormalizedPages() {
  const allFiles = import.meta.glob("../pages/**/*.{astro,md,mdx}", {
    eager: true,
  });

  return Object.entries(allFiles).map(([path, file]) => {
    let url = path
      .replace("../pages", "")
      .replace(/\.(astro|md|mdx)$/, "")
      .replace(/\/index$/, "");

    url = url.replace(/\/$/, "") || "/";

    return {
      url, // Internal key without trailing slash, used for tree matching
      href: url === "/" ? "/" : `${url}/`, // Public link — matches trailingSlash: "always"
      title:
        file.frontmatter?.title ||
        url.split("/").pop()?.replace(/-/g, " ") ||
        "Home",
      order: file.frontmatter?.order ?? 99,
      hidden: file.frontmatter?.hidden || false,
      group: file.frontmatter?.group || "", // e.g. "Visual Identity" — sub-menu heading

      excerpt: file.frontmatter?.excerpt || "",
      noindex: file.frontmatter?.noindex || false,
      is404: path.endsWith("404.astro") || path.endsWith("404.md"),
    };
  });
}

/**
 * URL Helpers
 */
export function getUrlContext(pathname) {
  const currentPath = pathname.replace(/\/$/, "") || "/";
  const segments = currentPath.split("/").filter(Boolean);
  const parentPath = "/" + segments.slice(0, -1).join("/");

  return {
    currentPath,
    parentPath,
    isRoot: currentPath === "/",
    depth: segments.length,
  };
}

/**
 * Relationship Helpers
 */
export async function getNavigation(pathname) {
  const { currentPath, parentPath, depth } = getUrlContext(pathname);
  const allPages = await getNormalizedPages();
  const activePages = allPages.filter((p) => !p.hidden);

  return {
    current: activePages.find((p) => p.url === currentPath),
    parent: activePages.find((p) => p.url === parentPath),
    siblings: activePages
      .filter((p) => {
        const pSegs = p.url.split("/").filter(Boolean).length;
        return (
          pSegs === depth &&
          (p.url.startsWith(parentPath + "/") || parentPath === "/")
        );
      })
      .filter((p) => !p.url?.includes("404"))
      .sort((a, b) => a.order - b.order),
    children: activePages
      .filter((p) => {
        const pSegs = p.url.split("/").filter(Boolean).length;
        return pSegs === depth + 1 && p.url.startsWith(currentPath);
      })
      .sort((a, b) => a.order - b.order),
  };
}

/**
 * buildTree Logic
 * Converts flat array into nested structure
 */
function buildTree(items) {
  const root = [];
  const map = {};

  items.forEach((item) => {
    map[item.url] = { ...item, children: [] };
  });

  items.forEach((item) => {
    const segments = item.url.split("/").filter(Boolean);
    if (segments.length <= 1) {
      root.push(map[item.url]);
    } else {
      const parentPath = "/" + segments.slice(0, -1).join("/");
      if (map[parentPath]) {
        map[parentPath].children.push(map[item.url]);
      } else {
        root.push(map[item.url]);
      }
    }
  });

  return root;
}

export async function getFullMenu() {
  const pages = await getNormalizedPages();
  const sorted = pages
    .filter((p) => !p.url?.includes("404") && !p.hidden)
    .sort((a, b) => a.order - b.order);
  return buildTree(sorted);
}

/**
 * Top-level menu, one level of children deep (no grandchildren)
 */
export async function getTopMenu() {
  const tree = await getFullMenu();
  return tree.map((node) => ({
    ...node,
    children: (node.children || []).map((child) => ({
      ...child,
      children: [],
    })),
  }));
}

function flattenTree(nodes) {
  const result = [];
  for (const node of nodes) {
    result.push(node);
    if (node.children?.length) {
      result.push(...flattenTree(node.children));
    }
  }
  return result;
}

export async function getFlatMenu() {
  const tree = await getFullMenu();
  return flattenTree(tree).filter((p) => !p.hidden);
}
