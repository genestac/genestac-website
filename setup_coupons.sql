CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);
GRANT SELECT ON public.coupons TO anon, authenticated;
INSERT INTO public.coupons (influencer_name, coupon_code, start_date, plan_discounts, max_uses, usage_count, is_active) 
VALUES (
    'Test Influencer', 
    'GENESTAC20', 
    NOW(), 
    '{"237ff468-839d-4b5e-8658-39932b6882bd": 20, "0acab2ef-3b7a-43a5-9ecb-b28896c9d123": 20, "d566989c-2943-40bc-a713-1605ebfc1227": 20}'::jsonb, 
    100, 
    0, 
    true
) ON CONFLICT (coupon_code) DO NOTHING;
