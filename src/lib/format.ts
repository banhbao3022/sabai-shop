import { siteConfig } from "@/lib/config";

/** Format an integer amount as a currency string, e.g. `179,000 LAK`. */
export function formatPrice(amount: number): string {
  const { numberLocale, fractionDigits, code } = siteConfig.currency;
  const value = new Intl.NumberFormat(numberLocale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
  return `${value} ${code}`;
}

/** Percentage saved when a product has a higher `fullPrice`. */
export function discountPercent(price: number, fullPrice?: number | null): number {
  if (!fullPrice || fullPrice <= price) return 0;
  return Math.round(((fullPrice - price) / fullPrice) * 100);
}

/** wa.me deep link for WhatsApp with an optional prefilled message. */
export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Facebook Messenger deep link. */
export function messengerLink(handle: string): string {
  return `https://m.me/${handle}`;
}

/** Instagram profile link. */
export function instagramLink(handle: string): string {
  return `https://instagram.com/${handle}`;
}

/**
 * Generate a human-friendly order id, e.g. `SB-20260704-8F3K`.
 * Uses date + random suffix; collision risk is negligible for a small shop.
 */
export function generateOrderId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SB-${y}${m}${d}-${rand}`;
}
