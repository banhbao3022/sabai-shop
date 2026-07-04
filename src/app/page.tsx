import { Hero } from "@/components/home/hero";
import { CategorySection } from "@/components/home/category-section";
import { ProductSection } from "@/components/home/product-section";
import {
  getCategories,
  getFeaturedProducts,
  getNewArrivals,
  countProductsByCategory,
} from "@/lib/data";
import { siteConfig } from "@/lib/config";
import { getStructuredData } from "@/lib/seo";

export default function HomePage() {
  const categories = getCategories();
  const counts = countProductsByCategory();
  const featured = getFeaturedProducts(8);
  const arrivals = getNewArrivals(8);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getStructuredData("website")),
        }}
      />
      <Hero />
      <CategorySection categories={categories} counts={counts} />
      <ProductSection titleKey="featured" products={featured} priorityCount={4} />
      <ProductSection titleKey="newArrivals" products={arrivals} />
      <div className="sr-only">
        <h2>{siteConfig.name}</h2>
        <p>{siteConfig.about}</p>
      </div>
    </>
  );
}
