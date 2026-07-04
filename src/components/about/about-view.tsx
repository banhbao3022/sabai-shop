"use client";

import Link from "next/link";
import { Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AboutView() {
  const { locale, t } = useI18n();
  const about = locale === "lo" ? siteConfig.aboutLo : siteConfig.about;
  const brand = locale === "lo" ? siteConfig.nameLo : siteConfig.name;

  const perks = [
    { Icon: Truck, title: locale === "lo" ? "ພ້ອມສົ່ງ" : "Ready to ship" },
    { Icon: ShieldCheck, title: locale === "lo" ? "ຂອງແທ້ 100%" : "100% authentic" },
    { Icon: MessageCircle, title: locale === "lo" ? "ຕອບໄວ" : "Fast replies" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.nav.about}</h1>
        <p className="text-muted-foreground mt-4 leading-relaxed">{about}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {perks.map(({ Icon, title }) => (
          <div key={title} className="bg-card flex flex-col items-center gap-2 rounded-xl border p-5 text-center">
            <Icon className="text-primary size-7" />
            <span className="text-sm font-medium">{title}</span>
          </div>
        ))}
      </div>

      <div className="bg-accent/50 flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
        <p className="font-medium">{brand}</p>
        <p className="text-muted-foreground text-sm">{t.contact.subtitle}</p>
        <div className="flex gap-2">
          <Link href="/products" className={buttonVariants()}>{t.home.heroCta}</Link>
          <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }))}>
            {t.nav.contact}
          </Link>
        </div>
      </div>
    </div>
  );
}
