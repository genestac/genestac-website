export type PlanVariant = {
  id: string;
  plan_id: string;
  duration_label: string;
  duration_days: number;
  base_price: number;
  discounted_price: number | null;
  discount_text: string | null;
  discount_end_date: string | null;
  is_active: boolean;
};

export type PlanRecord = {
  id: string;
  name: string;
  description: string;
  cartName: string;
  cartPrice: number;
  price: string;
  cadence: string;
  term: string;
  cta: string;
  features: string[];
  featured?: boolean;
  note?: string;
  isEntryLevel?: boolean;
  gstPercentage: number;
  variants?: PlanVariant[];
};

type DbPlan = {
  id: string;
  name: string;
  description?: string | null;
  cart_name?: string | null;
  price: number | string;
  cadence?: string | null;
  term?: string | null;
  cta?: string | null;
  features?: string[] | null;
  is_featured?: boolean | null;
  note?: string | null;
  is_entry_level?: boolean | null;
  gst_percentage?: number | null;
  plan_variants?: PlanVariant[];
};

export function mapDbPlanToPlan(p: DbPlan): PlanRecord {
  const numericPrice = Number(p.price);

  return {
    id: p.id,
    name: p.name,
    description: p.description || "",
    cartName: p.cart_name || p.name,
    cartPrice: numericPrice,
    price: `₹${numericPrice.toLocaleString("en-IN")}`,
    cadence: p.cadence || "",
    term: p.term || "",
    cta: p.cta || `Choose ${p.name}`,
    features: Array.isArray(p.features) ? p.features : [],
    featured: Boolean(p.is_featured),
    note: p.note ?? undefined,
    isEntryLevel: Boolean(p.is_entry_level),
    gstPercentage: Number(p.gst_percentage) || 5,
    variants: Array.isArray(p.plan_variants)
      ? p.plan_variants.filter((v) => v.is_active)
      : undefined,
  };
}
