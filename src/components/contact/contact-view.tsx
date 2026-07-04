"use client";

import { MessageCircle, Send, Camera, Phone, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import {
  whatsappLink,
  messengerLink,
  instagramLink,
} from "@/lib/format";

interface Channel {
  label: string;
  value: string;
  href: string;
  Icon: LucideIcon;
  external?: boolean;
  tone: string;
}

export function ContactView() {
  const { locale, t } = useI18n();

  const channels: Channel[] = [
    {
      label: t.contact.whatsapp,
      value: siteConfig.contact.phoneDisplay,
      href: whatsappLink(siteConfig.contact.phone),
      Icon: MessageCircle,
      external: true,
      tone: "bg-[#25D366]/12 text-[#128C4A] dark:text-[#4ade80]",
    },
    {
      label: t.contact.messenger,
      value: `m.me/${siteConfig.contact.messenger}`,
      href: messengerLink(siteConfig.contact.messenger),
      Icon: Send,
      external: true,
      tone: "bg-[#0084FF]/12 text-[#0068c9] dark:text-[#5eb0ff]",
    },
    {
      label: t.contact.instagram,
      value: `@${siteConfig.contact.instagram}`,
      href: instagramLink(siteConfig.contact.instagram),
      Icon: Camera,
      external: true,
      tone: "bg-[#E1306C]/12 text-[#c72d63] dark:text-[#f472b6]",
    },
    {
      label: t.contact.call,
      value: siteConfig.contact.phoneDisplay,
      href: `tel:${siteConfig.contact.phone}`,
      Icon: Phone,
      tone: "bg-primary/12 text-primary",
    },
    {
      label: t.contact.email,
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
      Icon: Mail,
      tone: "bg-muted text-foreground",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.contact.title}</h1>
        <p className="text-muted-foreground mt-2">{t.contact.subtitle}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {channels.map((ch) => (
          <a
            key={ch.label}
            href={ch.href}
            target={ch.external ? "_blank" : undefined}
            rel={ch.external ? "noopener noreferrer" : undefined}
            className="bg-card hover:border-primary/40 flex items-center gap-4 rounded-xl border p-4 transition-colors hover:shadow-sm"
          >
            <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${ch.tone}`}>
              <ch.Icon className="size-6" />
            </span>
            <span className="min-w-0">
              <span className="block font-medium">{ch.label}</span>
              <span className="text-muted-foreground block truncate text-sm">{ch.value}</span>
            </span>
          </a>
        ))}
      </div>

      <p className="text-muted-foreground text-sm">
        {t.contact.hours} ·{" "}
        {locale === "lo" ? siteConfig.contact.addressLineLo : siteConfig.contact.addressLine}
      </p>
    </div>
  );
}
