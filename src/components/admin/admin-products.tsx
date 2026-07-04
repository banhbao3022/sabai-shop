"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Download, Upload, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductFormSheet } from "@/components/admin/product-form-sheet";
import { useCatalogStore } from "@/store/catalog";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import type { Catalog, Product } from "@/lib/types";

export function AdminProducts() {
  const { t } = useI18n();
  const catalog = useCatalogStore((s) => s.catalog);
  const deleteProduct = useCatalogStore((s) => s.deleteProduct);
  const importCatalog = useCatalogStore((s) => s.importCatalog);
  const reset = useCatalogStore((s) => s.reset);

  const [editing, setEditing] = useState<Product | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const categoryName = (id: string) =>
    catalog.categories.find((c) => c.id === id)?.name ?? id;

  const filtered = catalog.products.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const openAdd = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (product: Product) => {
    setEditing(product);
    setSheetOpen(true);
  };

  const remove = (product: Product) => {
    if (window.confirm(`${t.admin.deleteProduct}: ${product.name}?`)) {
      deleteProduct(product.id);
      toast.success(t.admin.deleted, { description: product.name });
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "catalog.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Catalog;
        if (Array.isArray(parsed.products) && Array.isArray(parsed.categories)) {
          importCatalog(parsed);
          toast.success(t.admin.saved);
        } else {
          toast.error("Invalid catalog file");
        }
      } catch {
        toast.error("Invalid JSON");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const onReset = () => {
    if (window.confirm(`${t.admin.resetCatalog}?`)) {
      reset();
      toast.success(t.admin.saved);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="size-4" />
          {t.admin.addProduct}
        </Button>
        <div className="relative ml-auto">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            className="h-9 w-48 pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={exportJson} className="gap-1.5">
          <Download className="size-4" />
          {t.admin.exportData}
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5">
          <Upload className="size-4" />
          {t.admin.importData}
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="size-4" />
          {t.admin.resetCatalog}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={onImport}
        />
      </div>

      <div className="bg-card overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>{t.products.category}</TableHead>
              <TableHead className="text-right">{t.common.price}</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="bg-muted relative size-10 overflow-hidden rounded-md">
                    <Image
                      src={product.images[0]}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-[220px]">
                  <span className="line-clamp-1 font-medium">{product.name}</span>
                  {product.featured && (
                    <Badge variant="secondary" className="mt-0.5">
                      {t.common.featured}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {categoryName(product.categoryId)}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell className="text-right">
                  {product.stock ?? "∞"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label="Edit" onClick={() => openEdit(product)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => remove(product)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-muted-foreground text-xs">{t.admin.publishHint}</p>

      <ProductFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        product={editing}
        categories={catalog.categories}
      />
    </div>
  );
}
