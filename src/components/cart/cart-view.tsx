"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { QuantityStepper } from "@/components/common/quantity-stepper";
import { useCartStore } from "@/store/cart";
import { getProductById } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { localized } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function CartView() {
  const { locale, t } = useI18n();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const note = useCartStore((s) => s.note);
  const setNote = useCartStore((s) => s.setNote);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const lines = items
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product!.price * l.item.quantity, 0);

  if (!hydrated) {
    return <div className="text-muted-foreground py-24 text-center">…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <ShoppingBag className="text-muted-foreground size-12" />
        <h1 className="text-xl font-bold">{t.cart.empty}</h1>
        <p className="text-muted-foreground">{t.cart.emptyDesc}</p>
        <Link href="/products" className={cn(buttonVariants(), "mt-2")}>
          {t.cart.continue}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.cart.title}</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {lines.map(({ item, product }) => (
            <div key={item.productId} className="bg-card flex gap-4 rounded-xl border p-3">
              <Link
                href={`/products/${product!.slug}`}
                className="bg-muted relative size-24 shrink-0 overflow-hidden rounded-lg"
              >
                <Image
                  src={product!.images[0]}
                  alt={localized(product!, "name", locale)}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${product!.slug}`}
                    className="line-clamp-2 font-medium hover:underline"
                  >
                    {localized(product!, "name", locale)}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t.cart.remove}
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="flex items-end justify-between gap-2">
                  <QuantityStepper
                    value={item.quantity}
                    max={product!.stock}
                    onChange={(q) => setQuantity(item.productId, q)}
                  />
                  <span className="text-price font-semibold">
                    {formatPrice(product!.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="cart-note">{t.cart.note}</Label>
            <Textarea
              id="cart-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.cart.notePlaceholder}
              rows={3}
            />
          </div>
        </div>

        <aside className="bg-card h-fit space-y-3 rounded-xl border p-5 lg:sticky lg:top-20">
          <h2 className="font-semibold">{t.checkout.summary}</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t.cart.subtotal}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t.cart.shipping}</span>
            <span className="text-muted-foreground">{t.cart.shippingNote}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>{t.cart.total}</span>
            <span className="text-price">{formatPrice(subtotal)}</span>
          </div>
          <Link href="/checkout" className={cn(buttonVariants(), "h-11 w-full text-base")}>
            {t.cart.proceed}
          </Link>
          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            {t.cart.continue}
          </Link>
        </aside>
      </div>
    </div>
  );
}
