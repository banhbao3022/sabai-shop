import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <Container className="py-8">
      <CartView />
    </Container>
  );
}
