"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LocaleToggle() {
  const { locale, toggleLocale } = useI18n();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="font-semibold"
      aria-label="Switch language"
      onClick={toggleLocale}
    >
      {locale === "en" ? "ລາວ" : "EN"}
    </Button>
  );
}
