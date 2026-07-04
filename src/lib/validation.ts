import { z } from "zod";

/**
 * Checkout schema factory. Messages are injected so they can be localized.
 * Fields mirror the original storefront: name, phone, address, sub-district,
 * district, province, postal code (+ optional note). No email is collected.
 */
export function makeCustomerSchema(messages: {
  required: string;
  invalidPhone: string;
  minName: string;
}) {
  return z.object({
    name: z.string().trim().min(1, messages.minName),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]{6,}$/, messages.invalidPhone),
    address: z.string().trim().min(1, messages.required),
    subDistrict: z.string().trim().min(1, messages.required),
    district: z.string().trim().min(1, messages.required),
    province: z.string().trim().min(1, messages.required),
    postalCode: z.string().trim().optional(),
    note: z.string().trim().optional(),
  });
}

export type CustomerFormValues = z.infer<ReturnType<typeof makeCustomerSchema>>;
