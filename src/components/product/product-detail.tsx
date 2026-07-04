"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCart } from "@/components/product/add-to-cart";
import { Price } from "@/components/product/price";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeader } from "@/components/common/section-header";
import { useI18n, interpolate } from "@/lib/i18n";
import { localized, type Category, type Product } from "@/lib/types";
import { discountPercent } from "@/lib/format";

export function ProductDetail({
  product,
  category,
  related,
}: {
  product: Product;
  category?: Category;
  related: Product[];
}) {
  const { locale, t } = useI18n();
  const name = localized(product, "name", locale);
  const description = localized(product, "description", locale);
  const discount = discountPercent(product.price, product.fullPrice);
  const soldOut = product.stock !== null && product.stock <= 0;

  return (
    <div className="space-y-12">
      <nav aria-label="Breadcrumb" className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
        <Link href="/" className="hover:text-foreground">{t.nav.home}</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/products" className="hover:text-foreground">{t.nav.products}</Link>
        {category && (
          <>
            <ChevronRight className="size-3.5" />
            <Link href={`/categories/${category.slug}`} className="hover:text-foreground">
              {localized(category, "name", locale)}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} alt={name} />

        <div className="space-y-5">
          {category && (
            <Link
              href={`/categories/${category.slug}`}
              className="text-primary text-sm font-medium hover:underline"
            >
              {localized(category, "name", locale)}
            </Link>
          )}
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{name}</h1>

          <div className="flex flex-wrap items-center gap-3">
            <Price price={product.price} fullPrice={product.fullPrice} size="lg" />
            {discount > 0 && (
              <Badge className="bg-promo text-promo-foreground border-transparent">
                -{discount}% {t.common.off}
              </Badge>
            )}
          </div>

          <p className="text-sm">
            {soldOut ? (
              <span className="text-destructive font-medium">{t.common.outOfStock}</span>
            ) : product.stock !== null && product.stock <= 5 ? (
              <span className="text-promo font-medium">
                {interpolate(t.common.lowStock, { n: product.stock })}
              </span>
            ) : (
              <span className="text-primary font-medium">{t.common.inStock}</span>
            )}
          </p>

          <Separator />

          <AddToCart product={product} />

          {description && (
            <>
              <Separator />
              <div className="prose-sm text-muted-foreground max-w-none whitespace-pre-line leading-relaxed">
                {description}
              </div>
            </>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <SectionHeader title={t.common.related} />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
