import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { AboutView } from "@/components/about/about-view";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about our shop.",
};

export default function AboutPage() {
  return (
    <Container className="py-10">
      <AboutView />
    </Container>
  );
}
