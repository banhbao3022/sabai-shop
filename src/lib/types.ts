import type { Locale } from "@/lib/config";

/** A product category. Mirrors the shape of the analyzed Page365 catalog. */
export interface Category {
  id: string;
  /** URL slug, e.g. "skincare". */
  slug: string;
  name: string;
  nameLo: string;
}

/** A product in the catalog. */
export interface Product {
  id: string;
  slug: string;
  name: string;
  nameLo: string;
  description: string;
  descriptionLo: string;
  /** Current selling price, integer in the shop currency (LAK has no decimals). */
  price: number;
  /**
   * Original price before discount. When set and greater than `price`, the UI
   * shows a strike-through original price + a promotion badge.
   */
  fullPrice?: number | null;
  categoryId: string;
  /** One or more image URLs (relative to /public or absolute). First = cover. */
  images: string[];
  /** Units in stock. `null` = treat as always available. */
  stock: number | null;
  /** Marks the product as featured on the homepage. */
  featured?: boolean;
  createdAt: string;
}

/** The full catalog payload stored as JSON (and edited by the admin). */
export interface Catalog {
  categories: Category[];
  products: Product[];
}

/** An item inside the shopping cart. */
export interface CartItem {
  productId: string;
  quantity: number;
}

/** Localized helper picking the right language field from a bilingual record. */
export function localized<T>(
  record: T,
  key: keyof T & string,
  locale: Locale,
): string {
  if (locale === "lo") {
    const loValue = record[`${key}Lo` as keyof T];
    if (typeof loValue === "string" && loValue.trim().length > 0) {
      return loValue;
    }
  }
  const value = record[key];
  return typeof value === "string" ? value : String(value ?? "");
}

/** Shipping/contact details collected at checkout (mirrors the original shop). */
export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  note?: string;
}

export type OrderStatus = "new" | "confirmed" | "shipped" | "done" | "cancelled";

/** A stored order line (snapshotted so it survives catalog edits). */
export interface OrderLine {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

/** A placed order. */
export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: CustomerInfo;
  lines: OrderLine[];
  subtotal: number;
  total: number;
}
