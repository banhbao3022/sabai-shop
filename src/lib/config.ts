/**
 * Central site configuration.
 *
 * This is the single place to change branding, contact channels, currency and
 * SEO defaults. Everything else in the app reads from here.
 */

export type Locale = "en" | "lo";

export interface SiteConfig {
  /** Canonical brand name (English / Latin). */
  name: string;
  /** Brand name in Lao script. */
  nameLo: string;
  /** Short tagline shown in the hero + meta description. */
  tagline: string;
  taglineLo: string;
  /** Longer "about" blurb. */
  about: string;
  aboutLo: string;
  /** Absolute site URL, used for canonical + OpenGraph + sitemap. */
  url: string;
  /** Default OpenGraph / social share image (relative to basePath). */
  ogImage: string;
  currency: {
    code: string;
    /** Locale used for Intl.NumberFormat grouping (kip has no decimals). */
    numberLocale: string;
    fractionDigits: number;
  };
  locales: Locale[];
  defaultLocale: Locale;
  contact: {
    /** Phone in international format, digits only (used for wa.me + tel:). */
    phone: string;
    phoneDisplay: string;
    email: string;
    /** Facebook page id or username for m.me + facebook.com. */
    messenger: string;
    instagram: string;
    /** Free-text address shown on the contact page. */
    addressLine: string;
    addressLineLo: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Sabai Shop",
  nameLo: "ຮ້ານ ສະບາຍ",
  tagline: "Everyday beauty & lifestyle picks, ready to ship.",
  taglineLo: "ສິນຄ້າຄວາມງາມ ແລະ ໄລຟ໌ສະໄຕລ໌ ພ້ອມສົ່ງທຸກມື້.",
  about:
    "Sabai Shop is a small demo storefront showcasing skincare, cosmetics and cute lifestyle goods. Browse the catalog, add items to your cart and place an order — no account required.",
  aboutLo:
    "Sabai Shop ເປັນຮ້ານຕົວຢ່າງ ຂາຍສິນຄ້າບຳລຸງຜິວ, ເຄື່ອງສຳອາງ ແລະ ຂອງໃຊ້ໜ້າຮັກ. ເລືອກຊື້ໄດ້ເລີຍ ບໍ່ຕ້ອງສະໝັກສະມາຊິກ.",
  url: "https://sabai-shop.example.com",
  ogImage: "/og.svg",
  currency: {
    code: "LAK",
    numberLocale: "en-US",
    fractionDigits: 0,
  },
  locales: ["en", "lo"],
  defaultLocale: "en",
  contact: {
    phone: "8562000000000",
    phoneDisplay: "+856 20 0000 0000",
    email: "hello@sabai-shop.example.com",
    messenger: "sabaishop",
    instagram: "sabai.shop",
    addressLine: "Vientiane, Laos",
    addressLineLo: "ນະຄອນຫຼວງວຽງຈັນ, ລາວ",
  },
};

/** Prefix a public asset/route with the configured base path (for GitHub Pages). */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}
