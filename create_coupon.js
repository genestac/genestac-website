const fs = require('fs');
const env = fs.readFileSync('/home/Neelesh/Desktop/genestac-mobile/.env', 'utf-8');
const url = env.split('\n').find(l => l.startsWith('EXPO_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const key = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY')).split('=')[1].trim();

async function main() {
  let res = await fetch(`${url}/rest/v1/plans?select=id`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
  const plans = await res.json();
  
  res = await fetch(`${url}/rest/v1/plan_variants?select=id`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
  const variants = await res.json();

  const planDiscounts = {};
  plans.forEach(p => { planDiscounts[p.id] = "100" });
  variants.forEach(v => { planDiscounts[v.id] = "100" });

  const coupon = {
    coupon_code: "WELCOME100",
    influencer_name: "John Doe",
    influencer_email: "john@example.com",
    influencer_phone: "+1234567890",
    is_active: true,
    start_date: new Date().toISOString(),
    end_date: null,
    max_uses: null,
    usage_count: 3,
    plan_discounts: planDiscounts
  };

  res = await fetch(`${url}/rest/v1/coupons`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(coupon)
  });
  
  if (!res.ok) {
    console.error(await res.text());
  } else {
    console.log("Coupon created successfully!");
  }
}

main().catch(console.error);
