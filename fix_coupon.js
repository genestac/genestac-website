const fs = require('fs');
const env = fs.readFileSync('/home/Neelesh/Desktop/genestac-mobile/.env', 'utf-8');
const url = env.split('\n').find(l => l.startsWith('EXPO_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const key = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY')).split('=')[1].trim();

async function main() {
  // Fetch plans
  let res = await fetch(`${url}/rest/v1/plans?select=id`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
  const plans = await res.json();
  const planIds = plans.map(p => p.id);

  // Fetch variants
  res = await fetch(`${url}/rest/v1/plan_variants?select=id,plan_id`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
  const variants = await res.json();
  const variantIds = variants.map(v => v.id);

  // Plans that have variants
  const plansWithVariants = new Set(variants.map(v => v.plan_id));

  // Fetch WELCOME100
  res = await fetch(`${url}/rest/v1/coupons?coupon_code=eq.WELCOME100`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
  const coupons = await res.json();
  if (!coupons.length) return console.log("Coupon not found");
  
  const coupon = coupons[0];
  const oldDiscounts = coupon.plan_discounts || {};
  const newDiscounts = {};

  for (const [k, v] of Object.entries(oldDiscounts)) {
    if (variantIds.includes(k)) {
      newDiscounts[k] = v; // Keep variant
    } else if (planIds.includes(k) && !plansWithVariants.has(k)) {
      newDiscounts[k] = v; // Keep base plan only if it has NO variants
    }
  }

  res = await fetch(`${url}/rest/v1/coupons?id=eq.${coupon.id}`, {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ plan_discounts: newDiscounts })
  });

  if (!res.ok) {
    console.error(await res.text());
  } else {
    console.log("Coupon updated to contain only", Object.keys(newDiscounts).length, "items.");
  }
}

main().catch(console.error);
