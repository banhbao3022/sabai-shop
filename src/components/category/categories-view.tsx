"use client";

import { CategoryCard } from "@/components/category/category-card";
import { useI18n } from "@/lib/i18n";
import type { Category } from "@/lib/types";

export function CategoriesView({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t.nav.categories}
      </h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} count={counts[c.id]} />
        ))}
      </div>
    </div>
  );
}
