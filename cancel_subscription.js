const fs = require('fs');
const env = fs.readFileSync('/home/Neelesh/Desktop/genestac-mobile/.env', 'utf-8');
const url = env.split('\n').find(l => l.startsWith('EXPO_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const key = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY')).split('=')[1].trim();

async function main() {
  const subId = "95de9550-3401-4c3f-8441-357873b82c17";

  let res = await fetch(`${url}/rest/v1/subscriptions?id=eq.${subId}`, {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'cancelled' })
  });

  if (!res.ok) {
    console.error(await res.text());
  } else {
    console.log("Old subscription successfully cancelled.");
  }
}

main().catch(console.error);
