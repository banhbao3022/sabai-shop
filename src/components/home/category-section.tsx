"use client";

import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { CategoryCard } from "@/components/category/category-card";
import { useI18n } from "@/lib/i18n";
import type { Category } from "@/lib/types";

export function CategorySection({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  const { t } = useI18n();
  return (
    <section className="py-10">
      <Container>
        <SectionHeader
          title={t.home.shopByCategory}
          action={{ href: "/categories", label: t.home.viewAll }}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} count={counts[c.id]} />
          ))}
        </div>
      </Container>
    </section>
  );
}
