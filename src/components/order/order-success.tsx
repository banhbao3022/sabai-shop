"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, PackageX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrdersStore } from "@/store/orders";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function OrderSuccess() {
  const { t } = useI18n();
  const hydrated = useHydrated();
  const orders = useOrdersStore((s) => s.orders);
  // Reactively read the order id from the URL (works for client navigation
  // and keeps the page static-export compatible via the Suspense boundary).
  const id = useSearchParams().get("id") ?? undefined;
  const order = id ? orders.find((o) => o.id === id) : undefined;

  if (!hydrated) {
    return <div className="text-muted-foreground py-24 text-center">…</div>;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <PackageX className="text-muted-foreground size-12" />
        <h1 className="text-xl font-bold">{t.success.title}</h1>
        {id && <p className="text-muted-foreground">{t.success.orderId}: {id}</p>}
        <Link href="/" className={cn(buttonVariants(), "mt-2")}>
          {t.success.backHome}
        </Link>
      </div>
    );
  }

  const c = order.customer;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full">
          <CheckCircle2 className="size-9" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight">{t.success.title}</h1>
        <p className="text-muted-foreground">{t.success.subtitle}</p>
      </div>

      <div className="bg-accent/50 rounded-xl border p-5 text-center">
        <p className="text-muted-foreground text-sm">{t.success.orderId}</p>
        <p className="text-primary text-2xl font-bold tracking-wider">{order.id}</p>
        <p className="text-muted-foreground mt-1 text-xs">{t.success.saveNote}</p>
      </div>

      <div className="bg-card space-y-4 rounded-xl border p-5">
        <h2 className="font-semibold">{t.success.details}</h2>
        <ul className="space-y-2 text-sm">
          {order.lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {line.name} × {line.quantity}
              </span>
              <span>{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>{t.cart.total}</span>
          <span className="text-price">{formatPrice(order.total)}</span>
        </div>

        <Separator />
        <div>
          <h3 className="mb-1 text-sm font-semibold">{t.success.shipTo}</h3>
          <address className="text-muted-foreground text-sm not-italic">
            {c.name} · {c.phone}
            <br />
            {c.address}, {c.subDistrict}, {c.district}, {c.province}
            {c.postalCode ? ` ${c.postalCode}` : ""}
            {c.note ? (
              <>
                <br />
                <span className="italic">“{c.note}”</span>
              </>
            ) : null}
          </address>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link href="/products" className={buttonVariants()}>
          {t.success.keepShopping}
        </Link>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          {t.success.backHome}
        </Link>
      </div>
    </div>
  );
}
