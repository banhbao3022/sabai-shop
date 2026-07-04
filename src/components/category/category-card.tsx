"use client";

import Link from "next/link";
import {
  Sparkles,
  Palette,
  ShoppingBag,
  PencilLine,
  Gem,
  Home,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { localized, type Category } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  skincare: Sparkles,
  makeup: Palette,
  bags: ShoppingBag,
  stationery: PencilLine,
  accessories: Gem,
  home: Home,
};

export function CategoryCard({
  category,
  count,
}: {
  category: Category;
  count?: number;
}) {
  const { locale, t } = useI18n();
  const Icon = ICONS[category.id] ?? Tag;
  const name = localized(category, "name", locale);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group bg-card hover:border-primary/40 flex items-center gap-3 rounded-xl border p-4 transition-colors hover:shadow-sm"
    >
      <span className="bg-accent text-accent-foreground flex size-11 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-medium">{name}</span>
        {count !== undefined && (
          <span className="text-muted-foreground text-xs">
            {count} {t.common.items}
          </span>
        )}
      </span>
    </Link>
  );
}
