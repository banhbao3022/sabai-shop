"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";
import { useOrdersStore } from "@/store/orders";
import { getProductById } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { localized, type Order } from "@/lib/types";
import { formatPrice, generateOrderId } from "@/lib/format";
import { makeCustomerSchema, type CustomerFormValues } from "@/lib/validation";
import { useHydrated } from "@/hooks/use-hydrated";

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}

export function CheckoutForm() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const hydrated = useHydrated();

  const items = useCartStore((s) => s.items);
  const note = useCartStore((s) => s.note);
  const clear = useCartStore((s) => s.clear);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(makeCustomerSchema(t.form)),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      subDistrict: "",
      district: "",
      province: "",
      postalCode: "",
      note: "",
    },
  });

  const lines = items
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product!.price * l.item.quantity, 0);

  useEffect(() => {
    if (hydrated && lines.length === 0 && !submitted) {
      router.replace("/cart");
    }
  }, [hydrated, lines.length, router, submitted]);

  const onSubmit = (values: CustomerFormValues) => {
    setSubmitted(true);
    const order: Order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      status: "new",
      customer: {
        name: values.name,
        phone: values.phone,
        address: values.address,
        subDistrict: values.subDistrict,
        district: values.district,
        province: values.province,
        postalCode: values.postalCode ?? "",
        note: note || values.note || "",
      },
      lines: lines.map((l) => ({
        productId: l.product!.id,
        name: l.product!.name,
        price: l.product!.price,
        quantity: l.item.quantity,
      })),
      subtotal,
      total: subtotal,
    };
    addOrder(order);
    clear();
    router.push(`/order/success?id=${order.id}`);
  };

  if (!hydrated || lines.length === 0) {
    return <div className="text-muted-foreground py-24 text-center">…</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.checkout.title}</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-8 lg:grid-cols-[1fr_340px]"
      >
        <div className="bg-card space-y-4 rounded-xl border p-5">
          <h2 className="font-semibold">{t.checkout.shippingInfo}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label={t.checkout.name} error={errors.name?.message} required>
              <Input id="name" autoComplete="name" {...register("name")} />
            </Field>
            <Field id="phone" label={t.checkout.phone} error={errors.phone?.message} required>
              <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" {...register("phone")} />
            </Field>
          </div>

          <Field id="address" label={t.checkout.address} error={errors.address?.message} required>
            <Input id="address" autoComplete="street-address" {...register("address")} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="subDistrict" label={t.checkout.subDistrict} error={errors.subDistrict?.message} required>
              <Input id="subDistrict" {...register("subDistrict")} />
            </Field>
            <Field id="district" label={t.checkout.district} error={errors.district?.message} required>
              <Input id="district" {...register("district")} />
            </Field>
            <Field id="province" label={t.checkout.province} error={errors.province?.message} required>
              <Input id="province" {...register("province")} />
            </Field>
            <Field id="postalCode" label={t.checkout.postalCode} error={errors.postalCode?.message}>
              <Input id="postalCode" inputMode="numeric" {...register("postalCode")} />
            </Field>
          </div>
        </div>

        <aside className="bg-card h-fit space-y-4 rounded-xl border p-5 lg:sticky lg:top-20">
          <h2 className="font-semibold">{t.checkout.summary}</h2>
          <ul className="space-y-2 text-sm">
            {lines.map(({ item, product }) => (
              <li key={item.productId} className="flex justify-between gap-2">
                <span className="text-muted-foreground line-clamp-1">
                  {localized(product!, "name", locale)} × {item.quantity}
                </span>
                <span className="shrink-0">{formatPrice(product!.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>{t.cart.total}</span>
            <span className="text-price">{formatPrice(subtotal)}</span>
          </div>
          <Button type="submit" disabled={isSubmitting} className="h-11 w-full gap-2 text-base">
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? t.checkout.placing : t.checkout.confirm}
          </Button>
          <p className="text-muted-foreground text-center text-xs">{t.footer.demoNotice}</p>
        </aside>
      </form>
    </div>
  );
}
