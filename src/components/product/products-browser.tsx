"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { useI18n, interpolate } from "@/lib/i18n";
import { localized, type Category, type Product } from "@/lib/types";
import { filterProducts, type SortKey } from "@/lib/data";

const SELECT_CLASS =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring dark:bg-input/30";

const VALID_SORTS: SortKey[] = ["newest", "price-asc", "price-desc"];

export function ProductsBrowser({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const { locale, t } = useI18n();
  // Start from defaults so the statically-rendered HTML matches the first
  // client render (no hydration mismatch); URL filters are applied on mount.
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const mounted = useRef(false);

  // On mount, seed state from the URL. On subsequent changes, sync the URL so
  // filters stay shareable — without a server round-trip.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const params = new URLSearchParams(window.location.search);
      const urlSort = params.get("sort");
      const nextQ = params.get("q") ?? "";
      const nextCategory = params.get("category") ?? "";
      const nextSort = VALID_SORTS.includes(urlSort as SortKey)
        ? (urlSort as SortKey)
        : "newest";
      if (nextQ || nextCategory || nextSort !== "newest") {
        /* eslint-disable react-hooks/set-state-in-effect -- seed filters from URL on first mount */
        setQ(nextQ);
        setCategory(nextCategory);
        setSort(nextSort);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
      return;
    }
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, category, sort]);

  const filtered = useMemo(
    () => filterProducts(products, { query: q, categoryId: category || undefined, sort }),
    [products, q, category, sort],
  );

  const hasFilters = q.trim() !== "" || category !== "" || sort !== "newest";
  const clear = () => {
    setQ("");
    setCategory("");
    setSort("newest");
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t.products.title}
      </h1>
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            aria-label={t.common.search}
            className="h-9 pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-muted-foreground size-4 shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label={t.products.category}
            className={SELECT_CLASS}
          >
            <option value="">{t.common.allProducts}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {localized(c, "name", locale)}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label={t.products.sortBy}
            className={SELECT_CLASS}
          >
            <option value="newest">{t.products.newest}</option>
            <option value="price-asc">{t.products.priceLow}</option>
            <option value="price-desc">{t.products.priceHigh}</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {interpolate(t.products.results, { n: filtered.length })}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clear} className="gap-1">
            <X className="size-3.5" />
            {t.products.clear}
          </Button>
        )}
      </div>

      {filtered.length > 0 ? (
        <ProductGrid products={filtered} priorityCount={4} />
      ) : (
        <div className="text-muted-foreground py-16 text-center">
          {t.products.noResults}
        </div>
      )}
    </div>
  );
}
