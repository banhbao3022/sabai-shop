"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCatalogStore } from "@/store/catalog";
import { useI18n } from "@/lib/i18n";
import type { Category, Product } from "@/lib/types";

const SELECT_CLASS =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `item-${Date.now()}`;
}

interface FormState {
  name: string;
  nameLo: string;
  categoryId: string;
  price: string;
  fullPrice: string;
  stock: string;
  images: string;
  description: string;
  descriptionLo: string;
  featured: boolean;
}

function toFormState(product: Product | null, categories: Category[]): FormState {
  return {
    name: product?.name ?? "",
    nameLo: product?.nameLo ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    price: product ? String(product.price) : "",
    fullPrice: product?.fullPrice ? String(product.fullPrice) : "",
    stock: product?.stock != null ? String(product.stock) : "",
    images: product?.images.join("\n") ?? "",
    description: product?.description ?? "",
    descriptionLo: product?.descriptionLo ?? "",
    featured: product?.featured ?? false,
  };
}

export function ProductFormSheet({
  open,
  onOpenChange,
  product,
  categories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
}) {
  const { t } = useI18n();
  const upsertProduct = useCatalogStore((s) => s.upsertProduct);
  const [form, setForm] = useState<FormState>(() => toFormState(product, categories));

  // Reset the form to the selected product each time the sheet opens.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resync form when the sheet (re)opens
    if (open) setForm(toFormState(product, categories));
  }, [open, product, categories]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = () => {
    if (!form.name.trim()) {
      toast.error(t.form.minName);
      return;
    }
    if (!form.categoryId) {
      toast.error(t.products.category);
      return;
    }
    const price = Number(form.price);
    if (Number.isNaN(price) || price < 0) {
      toast.error(t.common.price);
      return;
    }
    const slug = product?.slug ?? slugify(form.name);
    const images = form.images
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    const next: Product = {
      id: product?.id ?? slug,
      slug,
      name: form.name.trim(),
      nameLo: form.nameLo.trim(),
      description: form.description.trim(),
      descriptionLo: form.descriptionLo.trim(),
      price,
      fullPrice: form.fullPrice.trim() === "" ? null : Number(form.fullPrice),
      categoryId: form.categoryId,
      images: images.length > 0 ? images : ["/logo.svg"],
      stock: form.stock.trim() === "" ? null : Number(form.stock),
      featured: form.featured,
      createdAt: product?.createdAt ?? new Date().toISOString(),
    };

    upsertProduct(next);
    toast.success(t.admin.saved, { description: next.name });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle>{product ? t.admin.editProduct : t.admin.addProduct}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pf-name">Name (EN)</Label>
              <Input id="pf-name" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-nameLo">Name (ລາວ)</Label>
              <Input id="pf-nameLo" value={form.nameLo} onChange={(e) => set("nameLo", e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-cat">{t.products.category}</Label>
            <select
              id="pf-cat"
              className={SELECT_CLASS}
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="pf-price">{t.common.price}</Label>
              <Input id="pf-price" inputMode="numeric" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-full">Original</Label>
              <Input id="pf-full" inputMode="numeric" value={form.fullPrice} onChange={(e) => set("fullPrice", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-stock">Stock</Label>
              <Input id="pf-stock" inputMode="numeric" placeholder="∞" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-images">Image URLs (one per line)</Label>
            <Textarea id="pf-images" rows={3} value={form.images} onChange={(e) => set("images", e.target.value)} placeholder="/products/example-1.svg" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-desc">Description (EN)</Label>
            <Textarea id="pf-desc" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-descLo">Description (ລາວ)</Label>
            <Textarea id="pf-descLo" rows={3} value={form.descriptionLo} onChange={(e) => set("descriptionLo", e.target.value)} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-primary size-4"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            {t.common.featured}
          </label>
        </div>

        <SheetFooter className="border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
