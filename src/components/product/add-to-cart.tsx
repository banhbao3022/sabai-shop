"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/common/quantity-stepper";
import { useCartStore } from "@/store/cart";
import { useI18n } from "@/lib/i18n";
import { localized, type Product } from "@/lib/types";
import { siteConfig } from "@/lib/config";
import { whatsappLink, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function AddToCart({ product }: { product: Product }) {
  const { locale, t } = useI18n();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  const name = localized(product, "name", locale);
  const soldOut = product.stock !== null && product.stock <= 0;

  const add = () => {
    addItem(product.id, qty);
    toast.success(t.common.added, { description: name });
  };

  const waMessage = `${name} (${formatPrice(product.price)}) x${qty}`;

  return (
    <div className="space-y-4">
      {!soldOut && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{t.common.quantity}</span>
          <QuantityStepper value={qty} onChange={setQty} max={product.stock} />
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={add}
          disabled={soldOut}
          className={cn("h-12 flex-1 gap-2 text-base", soldOut && "opacity-60")}
        >
          <ShoppingBag className="size-5" />
          {soldOut ? t.common.outOfStock : t.common.addToCart}
        </Button>
        <a
          href={whatsappLink(siteConfig.contact.phone, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="border-input hover:bg-muted inline-flex h-12 items-center justify-center gap-2 rounded-lg border px-5 text-base font-medium"
        >
          <MessageCircle className="size-5" />
          {t.contact.whatsapp}
        </a>
      </div>
    </div>
  );
}
