"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { QuantityStepper } from "@/components/common/quantity-stepper";
import { Price } from "@/components/product/price";
import { useCartStore } from "@/store/cart";
import { getProductById } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { localized } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useHydrated } from "@/hooks/use-hydrated";

export function CartSheet() {
  const [open, setOpen] = useState(false);
  const { locale, t } = useI18n();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const lines = items
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((l) => l.product);
  const count = hydrated ? items.reduce((s, i) => s + i.quantity, 0) : 0;
  const subtotal = lines.reduce(
    (sum, l) => sum + l.product!.price * l.item.quantity,
    0,
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label={t.cart.title}
        onClick={() => setOpen(true)}
      >
        <ShoppingBag className="size-5" />
        {count > 0 && (
          <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[0.65rem] font-semibold">
            {count}
          </span>
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>{t.cart.title}</SheetTitle>
          </SheetHeader>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
              <ShoppingBag className="text-muted-foreground size-10" />
              <p className="font-medium">{t.cart.empty}</p>
              <p className="text-muted-foreground text-sm">{t.cart.emptyDesc}</p>
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {lines.map(({ item, product }) => (
                <div key={item.productId} className="flex gap-3">
                  <Link
                    href={`/products/${product!.slug}`}
                    onClick={() => setOpen(false)}
                    className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-lg"
                  >
                    <Image
                      src={product!.images[0]}
                      alt={localized(product!, "name", locale)}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${product!.slug}`}
                      onClick={() => setOpen(false)}
                      className="line-clamp-2 text-sm font-medium hover:underline"
                    >
                      {localized(product!, "name", locale)}
                    </Link>
                    <Price
                      price={product!.price}
                      fullPrice={product!.fullPrice}
                      size="sm"
                      className="mt-1"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <QuantityStepper
                        value={item.quantity}
                        max={product!.stock}
                        onChange={(q) => setQuantity(item.productId, q)}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t.cart.remove}
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {lines.length > 0 && (
            <SheetFooter className="border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.cart.subtotal}</span>
                <span className="text-price font-bold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ variant: "outline" })}
                >
                  {t.cart.title}
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ variant: "default" })}
                >
                  {t.cart.checkout}
                </Link>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
