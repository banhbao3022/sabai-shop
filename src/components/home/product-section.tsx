"use client";

import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { ProductGrid } from "@/components/product/product-grid";
import { useI18n } from "@/lib/i18n";
import type { Product } from "@/lib/types";

type TitleKey = "featured" | "newArrivals";

export function ProductSection({
  titleKey,
  products,
  priorityCount = 0,
}: {
  titleKey: TitleKey;
  products: Product[];
  priorityCount?: number;
}) {
  const { t } = useI18n();
  if (products.length === 0) return null;

  return (
    <section className="py-10">
      <Container>
        <SectionHeader
          title={t.home[titleKey]}
          action={{ href: "/products", label: t.home.viewAll }}
        />
        <ProductGrid products={products} priorityCount={priorityCount} />
      </Container>
    </section>
  );
}
