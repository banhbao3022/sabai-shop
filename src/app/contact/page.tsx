import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ContactView } from "@/components/contact/contact-view";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with us on WhatsApp, Messenger or Instagram.",
};

export default function ContactPage() {
  return (
    <Container className="py-10">
      <ContactView />
    </Container>
  );
}
