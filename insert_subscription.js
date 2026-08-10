const fs = require('fs');
const env = fs.readFileSync('/home/Neelesh/Desktop/genestac-mobile/.env', 'utf-8');
const url = env.split('\n').find(l => l.startsWith('EXPO_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const key = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY')).split('=')[1].trim();

async function main() {
  const email = "chauhansk12345@gmail.com";
  
  let res = await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
  const users = await res.json();
  const userId = users[0].id;

  res = await fetch(`${url}/rest/v1/orders?user_id=eq.${userId}&status=eq.confirmed&order=created_at.desc&limit=1`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
  const orders = await res.json();
  const orderId = orders[0].id;

  res = await fetch(`${url}/rest/v1/order_items?order_id=eq.${orderId}`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
  const items = await res.json();
  const planItem = items.find(i => (i.item_type === 'plan' || !i.item_type) && i.plan_id);

  let days = 30;
  if (planItem.variant_id) {
    res = await fetch(`${url}/rest/v1/plan_variants?id=eq.${planItem.variant_id}&select=duration_days`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
    const variants = await res.json();
    if (variants.length && variants[0].duration_days) {
      days = variants[0].duration_days;
    }
  }

  res = await fetch(`${url}/rest/v1/plans?id=eq.${planItem.plan_id}&select=type`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
  const plansData = await res.json();
  const planType = plansData.length && plansData[0].type ? plansData[0].type : "weightloss";

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  const sub = {
    user_id: userId,
    plan_id: planItem.plan_id,
    plan_type: planType,
    quantity: 1,
    start_date: startDate.toISOString().split("T")[0],
    end_date: endDate.toISOString().split("T")[0],
    status: "active"
  };

  res = await fetch(`${url}/rest/v1/subscriptions`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(sub)
  });

  if (!res.ok) {
    console.error(await res.text());
  } else {
    console.log("Subscription manually created!");
  }
}

main().catch(console.error);
