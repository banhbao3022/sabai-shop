import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How this demo store handles your information.",
};

export default function PrivacyPage() {
  return (
    <Container className="prose-headings:font-semibold max-w-3xl space-y-6 py-10 text-sm leading-relaxed">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground mt-1">Last updated: {new Date().getFullYear()}</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-muted-foreground">
          {siteConfig.name} is a demo storefront. This page explains what
          information is handled when you use the site.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Information we collect</h2>
        <p className="text-muted-foreground">
          When you place an order we collect the recipient name, phone number and
          shipping address you enter at checkout. We do not collect payment
          details and we do not require an account.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How your information is stored</h2>
        <p className="text-muted-foreground">
          In this demo, orders and cart contents are stored locally in your own
          web browser (localStorage). No order data is transmitted to or stored on
          a server, and no payment is processed.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Cookies & analytics</h2>
        <p className="text-muted-foreground">
          The demo does not set advertising cookies. If analytics are enabled in a
          deployment, only aggregate, non-identifying usage data is collected.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="text-muted-foreground">
          Questions about this policy? Email{" "}
          <a className="text-primary hover:underline" href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </section>
    </Container>
  );
}
