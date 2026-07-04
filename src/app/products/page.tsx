import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ProductsBrowser } from "@/components/product/products-browser";
import { getProducts, getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "All products",
  description: "Browse the full catalog — search, filter by category and sort by price.",
};

export default function ProductsPage() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <Container className="py-8">
      <ProductsBrowser products={products} categories={categories} />
    </Container>
  );
}
