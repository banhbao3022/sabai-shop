"use client";

import { toast } from "sonner";
import { Download, Trash2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrdersStore } from "@/store/orders";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["new", "confirmed", "shipped", "done", "cancelled"];

const SELECT_CLASS =
  "h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function csvCell(value: string | number): string {
  const s = String(value).replace(/"/g, '""');
  return `"${s}"`;
}

export function AdminOrders() {
  const { t } = useI18n();
  const orders = useOrdersStore((s) => s.orders);
  const updateStatus = useOrdersStore((s) => s.updateStatus);
  const clearOrders = useOrdersStore((s) => s.clearOrders);

  const exportCsv = () => {
    const header = [
      "Order ID", "Date", "Status", "Name", "Phone", "Address",
      "Sub-district", "District", "Province", "Postal", "Note", "Items", "Total",
    ];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toISOString(),
      o.status,
      o.customer.name,
      o.customer.phone,
      o.customer.address,
      o.customer.subDistrict,
      o.customer.district,
      o.customer.province,
      o.customer.postalCode,
      o.customer.note ?? "",
      o.lines.map((l) => `${l.name} x${l.quantity}`).join("; "),
      o.total,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map(csvCell).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onClear = () => {
    if (window.confirm(`${t.admin.clearOrders}?`)) {
      clearOrders();
      toast.success(t.admin.deleted);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
        <ClipboardList className="text-muted-foreground size-10" />
        <p className="text-muted-foreground">{t.admin.noOrders}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-muted-foreground text-sm">
          {orders.length} {t.admin.orders.toLowerCase()}
        </p>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1.5">
            <Download className="size-4" />
            {t.admin.exportOrders}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-1.5">
            <Trash2 className="size-4" />
            {t.admin.clearOrders}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {orders.map((order: Order) => (
          <div key={order.id} className="bg-card rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-primary font-bold">{order.id}</p>
                <p className="text-muted-foreground text-xs">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-price font-semibold">{formatPrice(order.total)}</span>
                <select
                  className={SELECT_CLASS}
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                  aria-label="Order status"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="text-sm">
                <p className="font-medium">{order.customer.name} · {order.customer.phone}</p>
                <p className="text-muted-foreground">
                  {order.customer.address}, {order.customer.subDistrict},{" "}
                  {order.customer.district}, {order.customer.province}
                  {order.customer.postalCode ? ` ${order.customer.postalCode}` : ""}
                </p>
                {order.customer.note && (
                  <p className="text-muted-foreground mt-1 italic">“{order.customer.note}”</p>
                )}
              </div>
              <ul className="text-muted-foreground space-y-1 text-sm">
                {order.lines.map((l) => (
                  <li key={l.productId} className="flex justify-between gap-2">
                    <span className="line-clamp-1">{l.name} × {l.quantity}</span>
                    <span>{formatPrice(l.price * l.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
