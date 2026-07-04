"use client";

import Image from "next/image";
import Link from "next/link";
import { Send, Camera, MessageCircle, Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { getCategories } from "@/lib/data";
import { localized } from "@/lib/types";
import {
  whatsappLink,
  messengerLink,
  instagramLink,
} from "@/lib/format";

export function SiteFooter() {
  const { locale, t } = useI18n();
  const categories = getCategories().slice(0, 6);

  const socials = [
    { href: whatsappLink(siteConfig.contact.phone), label: "WhatsApp", Icon: MessageCircle },
    { href: messengerLink(siteConfig.contact.messenger), label: "Messenger", Icon: Send },
    { href: instagramLink(siteConfig.contact.instagram), label: "Instagram", Icon: Camera },
    { href: `mailto:${siteConfig.contact.email}`, label: "Email", Icon: Mail },
  ];

  return (
    <footer className="bg-card mt-16 border-t">
      <Container className="py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="" width={28} height={28} className="size-7" />
              <span className="font-extrabold">
                {locale === "lo" ? siteConfig.nameLo : siteConfig.name}
              </span>
            </Link>
            <p className="text-muted-foreground mt-3 text-sm">{t.footer.tagline}</p>
            <div className="mt-4 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="bg-muted hover:bg-accent hover:text-accent-foreground flex size-9 items-center justify-center rounded-lg transition-colors"
                >
                  <Icon className="size-4.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">{t.footer.quickLinks}</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-foreground">{t.nav.products}</Link></li>
              <li><Link href="/categories" className="hover:text-foreground">{t.nav.categories}</Link></li>
              <li><Link href="/about" className="hover:text-foreground">{t.nav.about}</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">{t.nav.contact}</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">{t.footer.categories}</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/categories/${c.slug}`} className="hover:text-foreground">
                    {localized(c, "name", locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">{t.footer.contact}</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-foreground">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-foreground">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                {locale === "lo"
                  ? siteConfig.contact.addressLineLo
                  : siteConfig.contact.addressLine}
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            {locale === "lo" ? siteConfig.nameLo : siteConfig.name}. {t.footer.rights}
          </p>
          <p className="max-w-md">{t.footer.demoNotice}</p>
        </div>
      </Container>
    </footer>
  );
}
