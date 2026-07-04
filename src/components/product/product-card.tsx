"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/product/price";
import { useI18n, interpolate } from "@/lib/i18n";
import { localized, type Product } from "@/lib/types";
import { discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { locale, t } = useI18n();
  const name = localized(product, "name", locale);
  const discount = discountPercent(product.price, product.fullPrice);
  const soldOut = product.stock !== null && product.stock <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group focus-visible:ring-ring/60 block rounded-xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <article className="bg-card overflow-hidden rounded-xl border transition-shadow hover:shadow-md">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            priority={priority}
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-105",
              soldOut && "opacity-60",
            )}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <Badge className="bg-promo text-promo-foreground border-transparent">
                -{discount}% {t.common.off}
              </Badge>
            )}
            {product.featured && discount === 0 && (
              <Badge variant="secondary">{t.common.featured}</Badge>
            )}
          </div>
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black">
                {t.common.outOfStock}
              </span>
            </div>
          )}
        </div>
        <div className="space-y-1.5 p-3">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-medium">
            {name}
          </h3>
          <Price price={product.price} fullPrice={product.fullPrice} size="sm" />
          {product.stock !== null && product.stock > 0 && product.stock <= 5 && (
            <p className="text-promo text-xs">
              {interpolate(t.common.lowStock, { n: product.stock })}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
