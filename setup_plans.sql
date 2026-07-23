-- Run this in the Supabase SQL editor if the dashboard Plans tab is empty or blocked by RLS.

ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS cart_name text,
  ADD COLUMN IF NOT EXISTS cadence text,
  ADD COLUMN IF NOT EXISTS term text,
  ADD COLUMN IF NOT EXISTS cta text,
  ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS note text,
  ADD COLUMN IF NOT EXISTS is_entry_level boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS gst_percentage numeric DEFAULT 5.00;

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active plans" ON public.plans;
CREATE POLICY "Public can view active plans"
  ON public.plans
  FOR SELECT
  USING (is_active = true);

GRANT SELECT ON public.plans TO anon, authenticated;

INSERT INTO public.plans (
  id,
  name,
  price,
  is_active,
  description,
  cart_name,
  cadence,
  term,
  cta,
  features,
  is_featured,
  note,
  is_entry_level,
  gst_percentage
) VALUES
  (
    '33f8b94d-3953-4ea1-9ee4-b45175d283ad',
    'Initial Assessment',
    1499,
    true,
    'Not ready to commit? Start with a one-time assessment and doctor consultation.',
    'Initial Assessment and Doctor Consultation',
    'one-time',
    '',
    'Book Consultation',
    '["One-time doctor consultation","Initial health assessment","Understand your options","No long-term commitment"]'::jsonb,
    false,
    null,
    true,
    5.00
  ),
  (
    '237ff468-839d-4b5e-8658-39932b6882bd',
    'Starter',
    4999,
    true,
    'For people who want nutrition, exercise, and accountability.',
    'Starter Weight Loss Plan',
    '/mo',
    '₹12,999 / 90 Days',
    'Choose Starter',
    '["Initial health assessment","Structured nutrition plan","Practical exercise plan","Supplement guidance"]'::jsonb,
    false,
    null,
    false,
    5.00
  ),
  (
    '0acab2ef-3b7a-43a5-9ecb-b28896c9d123',
    'Medical',
    12999,
    true,
    'For people who need doctor-guided treatment.',
    'Medical Weight Loss Plan',
    'avg/mo',
    '₹34,999 / 90 Days',
    'Choose Medical',
    '["Doctor clinical review","Eligibility assessment","Treatment guidance","Side-effect & adherence monitoring","More frequent follow-up"]'::jsonb,
    true,
    'Medicine and labs extra',
    false,
    5.00
  ),
  (
    'd566989c-2943-40bc-a713-1605ebfc1227',
    'Premium',
    29999,
    true,
    'For people who want maximum support and monitoring.',
    'Premium Weight Loss Plan',
    '/mo',
    '₹79,999 / 90 Days',
    'Choose Premium',
    '["Dedicated doctor oversight","Nutrition & exercise coaching","Advanced supplement plan","Weekly check-ins"]'::jsonb,
    false,
    null,
    false,
    5.00
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  is_active = EXCLUDED.is_active,
  description = EXCLUDED.description,
  cart_name = EXCLUDED.cart_name,
  cadence = EXCLUDED.cadence,
  term = EXCLUDED.term,
  cta = EXCLUDED.cta,
  features = EXCLUDED.features,
  is_featured = EXCLUDED.is_featured,
  note = EXCLUDED.note,
  is_entry_level = EXCLUDED.is_entry_level,
  gst_percentage = EXCLUDED.gst_percentage;
