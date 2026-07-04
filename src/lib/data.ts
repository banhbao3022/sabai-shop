import catalogJson from "@/data/catalog.json";
import type { Catalog, Category, Product } from "@/lib/types";

/**
 * The seed catalog is the canonical source of truth for the storefront
 * (used for SSR/SSG + SEO). The admin panel can overlay edits in the browser
 * and export an updated JSON to publish. These helpers are pure and run on both
 * the server and the client.
 */
const catalog = catalogJson as Catalog;

export function getCatalog(): Catalog {
  return catalog;
}

export function getCategories(): Category[] {
  return catalog.categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return catalog.categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return catalog.categories.find((c) => c.id === id);
}

export function getProducts(): Product[] {
  return catalog.products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return catalog.products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return catalog.products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return catalog.products.filter((p) => p.categoryId === categoryId);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return catalog.products.filter((p) => p.featured).slice(0, limit);
}

export function getNewArrivals(limit = 8): Product[] {
  return [...catalog.products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return catalog.products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, limit);
}

export function countProductsByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of catalog.products) {
    counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
  }
  return counts;
}

export type SortKey = "newest" | "price-asc" | "price-desc";

/** Client-side search + category filter + sort used by the products page. */
export function filterProducts(
  products: Product[],
  {
    query,
    categoryId,
    sort,
  }: { query?: string; categoryId?: string; sort?: SortKey },
): Product[] {
  let result = products;

  if (categoryId) {
    result = result.filter((p) => p.categoryId === categoryId);
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameLo.includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  const sorted = [...result];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
  }
  return sorted;
}
