import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { OrderSuccess } from "@/components/order/order-success";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <Container className="py-12">
      <Suspense
        fallback={<div className="text-muted-foreground py-24 text-center">…</div>}
      >
        <OrderSuccess />
      </Suspense>
    </Container>
  );
}
