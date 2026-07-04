"use client";

import { Package, ClipboardList, Layers, Coins } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCatalogStore } from "@/store/catalog";
import { useOrdersStore } from "@/store/orders";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";

function StatCard({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card flex items-center gap-4 rounded-xl border p-5">
      <span className="bg-accent text-accent-foreground flex size-11 items-center justify-center rounded-lg">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export function AdminDashboard({
  onNavigate,
}: {
  onNavigate: (tab: "products" | "orders") => void;
}) {
  const { t } = useI18n();
  const catalog = useCatalogStore((s) => s.catalog);
  const orders = useOrdersStore((s) => s.orders);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard Icon={Package} label={t.admin.products} value={String(catalog.products.length)} />
        <StatCard Icon={Layers} label={t.footer.categories} value={String(catalog.categories.length)} />
        <StatCard Icon={ClipboardList} label={t.admin.orders} value={String(orders.length)} />
        <StatCard Icon={Coins} label={t.cart.total} value={formatPrice(revenue)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => onNavigate("products")} className="gap-1.5">
          <Package className="size-4" />
          {t.admin.products}
        </Button>
        <Button variant="outline" onClick={() => onNavigate("orders")} className="gap-1.5">
          <ClipboardList className="size-4" />
          {t.admin.orders}
        </Button>
      </div>

      <p className="text-muted-foreground bg-muted/50 rounded-lg border border-dashed p-4 text-sm">
        {t.admin.publishHint}
      </p>
    </div>
  );
}
