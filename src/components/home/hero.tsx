"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Hero() {
  const { locale, t } = useI18n();
  const tagline = locale === "lo" ? siteConfig.taglineLo : siteConfig.tagline;
  const brand = locale === "lo" ? siteConfig.nameLo : siteConfig.name;

  return (
    <section className="from-accent/60 relative overflow-hidden bg-gradient-to-br via-background to-background">
      <div className="bg-primary/10 pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl" />
      <Container className="relative py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-xl"
        >
          <span className="bg-background/80 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" />
            {t.common.featured}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {brand}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">{tagline}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/products"
              className={cn(buttonVariants({ variant: "default" }), "h-11 gap-2 px-6 text-base")}
            >
              {t.home.heroCta}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/categories"
              className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6 text-base")}
            >
              {t.home.heroSecondary}
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
