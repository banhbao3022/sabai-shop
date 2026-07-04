"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Catalog, Category, Product } from "@/lib/types";
import { getCatalog } from "@/lib/data";

/**
 * Admin-side catalog store. Starts from the seed catalog and lets the shop
 * owner add/edit/delete products & categories in the browser. Use "Export" to
 * download the updated catalog.json and commit it to publish for everyone.
 */
interface CatalogState {
  catalog: Catalog;
  /** True once the owner has made local edits (i.e. differs from the seed). */
  customized: boolean;
  upsertProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  upsertCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  importCatalog: (catalog: Catalog) => void;
  reset: () => void;
}

function seed(): Catalog {
  // Deep clone so store mutations never touch the imported JSON module.
  return structuredClone(getCatalog());
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      catalog: seed(),
      customized: false,
      upsertProduct: (product) =>
        set((state) => {
          const exists = state.catalog.products.some((p) => p.id === product.id);
          const products = exists
            ? state.catalog.products.map((p) =>
                p.id === product.id ? product : p,
              )
            : [product, ...state.catalog.products];
          return {
            catalog: { ...state.catalog, products },
            customized: true,
          };
        }),
      deleteProduct: (id) =>
        set((state) => ({
          catalog: {
            ...state.catalog,
            products: state.catalog.products.filter((p) => p.id !== id),
          },
          customized: true,
        })),
      upsertCategory: (category) =>
        set((state) => {
          const exists = state.catalog.categories.some(
            (c) => c.id === category.id,
          );
          const categories = exists
            ? state.catalog.categories.map((c) =>
                c.id === category.id ? category : c,
              )
            : [...state.catalog.categories, category];
          return {
            catalog: { ...state.catalog, categories },
            customized: true,
          };
        }),
      deleteCategory: (id) =>
        set((state) => ({
          catalog: {
            ...state.catalog,
            categories: state.catalog.categories.filter((c) => c.id !== id),
          },
          customized: true,
        })),
      importCatalog: (catalog) => set({ catalog, customized: true }),
      reset: () => set({ catalog: seed(), customized: false }),
    }),
    {
      name: "sabai.catalog",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
