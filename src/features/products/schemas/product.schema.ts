import { z } from "zod";

/** Factory, not a constant — see features/auth/schemas/login.schema.ts's
 * doc comment on why. `price` is in whole so'm (what the user types); the
 * form converts to price_cents (tiyin) only when building the API payload
 * — see product-form-dialog.tsx. Deliberately z.number(), not
 * z.coerce.number() — zod 4's coerce schemas have an `unknown` input type
 * that @hookform/resolvers' Resolver can't line up with react-hook-form's
 * inferred form values, so the string->number conversion happens at the
 * input itself instead (registered with `valueAsNumber: true`).
 *
 * price is optional — a product can be listed with no fixed price ("narxi
 * so'rov asosida"); see backend entity.Product.PriceCents's doc comment.
 * Deliberately plain z.number().optional(), not z.preprocess(...) to turn
 * an empty input's NaN into undefined first — z.preprocess's input type is
 * `unknown`, which breaks @hookform/resolvers' Resolver inference the same
 * way z.coerce.number() does (see the note above). The NaN->undefined
 * conversion happens at the input instead, via a custom setValueAs in
 * product-form-dialog.tsx's register call. */
export function buildProductSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(1, t("productNameRequired")).max(200, t("productNameTooLong")),
    description: z.string().max(2000, t("productDescriptionTooLong")).optional(),
    price: z.number().positive(t("productPricePositive")).optional(),
    is_active: z.boolean(),
  });
}

export type ProductFormValues = z.infer<ReturnType<typeof buildProductSchema>>;
