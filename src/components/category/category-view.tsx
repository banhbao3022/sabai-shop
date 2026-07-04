"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { useI18n, interpolate } from "@/lib/i18n";
import { localized, type Category, type Product } from "@/lib/types";

export function CategoryView({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const { locale, t } = useI18n();
  const name = localized(category, "name", locale);

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
        <Link href="/" className="hover:text-foreground">{t.nav.home}</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/categories" className="hover:text-foreground">{t.nav.categories}</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{name}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{name}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {interpolate(t.products.results, { n: products.length })}
        </p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} priorityCount={4} />
      ) : (
        <p className="text-muted-foreground py-16 text-center">{t.products.noResults}</p>
      )}
    </div>
  );
}
