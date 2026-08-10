const fs = require('fs');
const env = fs.readFileSync('/home/Neelesh/Desktop/genestac-mobile/.env', 'utf-8');
const url = env.split('\n').find(l => l.startsWith('EXPO_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const key = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY')).split('=')[1].trim();

async function main() {
  let res = await fetch(`${url}/rest/v1/users?name=ilike.*sarah*`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
  const users = await res.json();
  console.log("Users:", users);

  if (users.length > 0) {
    const userId = users[0].id;
    res = await fetch(`${url}/rest/v1/subscriptions?user_id=eq.${userId}&status=eq.active`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
    const subs = await res.json();
    console.log("Active Subscriptions for Sarah:", subs);
  }
}

main().catch(console.error);
