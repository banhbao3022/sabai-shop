"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";
import { CartSheet } from "@/components/layout/cart-sheet";
import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", key: "home" },
  { href: "/products", key: "products" },
  { href: "/categories", key: "categories" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

function SearchBar({
  onSubmitted,
  className,
}: {
  onSubmitted?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
    onSubmitted?.();
  };

  return (
    <form onSubmit={submit} className={cn("relative", className)} role="search">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.common.searchPlaceholder}
        aria-label={t.common.search}
        className="h-9 pl-9"
      />
    </form>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const label = (key: (typeof NAV)[number]["key"]) => t.nav[key];

  return (
    <header className="bg-background/85 sticky top-0 z-40 border-b backdrop-blur">
      <Container className="flex h-16 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="size-5" />
        </Button>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/logo.svg" alt="" width={32} height={32} className="size-8" />
          <span className="text-lg font-extrabold tracking-tight">
            {locale === "lo" ? siteConfig.nameLo : siteConfig.name}
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:bg-muted rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground",
              )}
            >
              {label(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SearchBar className="hidden w-56 md:block" />
          <LocaleToggle />
          <ThemeToggle />
          <CartSheet />
        </div>
      </Container>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader className="border-b">
            <SheetTitle>
              {locale === "lo" ? siteConfig.nameLo : siteConfig.name}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 p-4">
            <SearchBar onSubmitted={() => setMenuOpen(false)} />
            <nav className="grid gap-1">
              {NAV.map((item) => (
                <SheetClose
                  key={item.href}
                  nativeButton={false}
                  render={
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium",
                        isActive(item.href)
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted",
                      )}
                    >
                      {label(item.key)}
                    </Link>
                  }
                />
              ))}
              <SheetClose
                nativeButton={false}
                render={
                  <Link
                    href="/admin"
                    className="hover:bg-muted text-muted-foreground rounded-md px-3 py-2.5 text-sm font-medium"
                  >
                    {t.nav.admin}
                  </Link>
                }
              />
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
