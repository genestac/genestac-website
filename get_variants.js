const fs = require('fs');
const env = fs.readFileSync('/home/Neelesh/Desktop/genestac-mobile/.env', 'utf-8');
const url = env.split('\n').find(l => l.startsWith('EXPO_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const key = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY')).split('=')[1].trim();

async function main() {
  const res = await fetch(`${url}/rest/v1/plan_variants?select=id,duration_label,duration_days`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
  console.log(await res.json());
}
main();
