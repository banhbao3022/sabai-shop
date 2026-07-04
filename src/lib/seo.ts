import { siteConfig } from "@/lib/config";
import type { Product } from "@/lib/types";
import { getCategoryById } from "@/lib/data";

const base = siteConfig.url.replace(/\/$/, "");

/** JSON-LD for the site (WebSite + Organization + search action). */
export function getStructuredData(type: "website") {
  if (type === "website") {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: base,
      description: siteConfig.tagline,
      potentialAction: {
        "@type": "SearchAction",
        target: `${base}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: `${base}/logo.svg`,
      },
    };
  }
}

/** JSON-LD Product schema for a product detail page. */
export function productJsonLd(product: Product) {
  const category = getCategoryById(product.categoryId);
  const available =
    product.stock === null || product.stock > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) =>
      img.startsWith("http") ? img : `${base}${img}`,
    ),
    category: category?.name,
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: siteConfig.currency.code,
      price: product.price,
      availability: available,
      url: `${base}/products/${product.slug}`,
    },
  };
}

/** JSON-LD BreadcrumbList. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.url}`,
    })),
  };
}
