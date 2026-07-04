import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { CategoriesView } from "@/components/category/categories-view";
import { getCategories, countProductsByCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse products by category.",
};

export default function CategoriesPage() {
  const categories = getCategories();
  const counts = countProductsByCategory();
  return (
    <Container className="py-8">
      <CategoriesView categories={categories} counts={counts} />
    </Container>
  );
}
