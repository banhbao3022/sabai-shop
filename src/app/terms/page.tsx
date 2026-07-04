import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using this demo store.",
};

export default function TermsPage() {
  return (
    <Container className="max-w-3xl space-y-6 py-10 text-sm leading-relaxed">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground mt-1">Last updated: {new Date().getFullYear()}</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Demo store</h2>
        <p className="text-muted-foreground">
          {siteConfig.name} is a demonstration website. Products, prices and stock
          shown here are sample data for illustration only.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Orders</h2>
        <p className="text-muted-foreground">
          Placing an order records your request locally in your browser and does
          not create a binding sale or trigger any payment. A real deployment would
          confirm availability and arrange delivery and payment separately through
          the shop&apos;s contact channels.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Acceptable use</h2>
        <p className="text-muted-foreground">
          Please use the site lawfully and do not attempt to disrupt it or misuse
          the contact channels.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="text-muted-foreground">
          For questions about these terms, contact{" "}
          <a className="text-primary hover:underline" href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </section>
    </Container>
  );
}
