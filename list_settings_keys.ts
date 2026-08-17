import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { persistSession: false } }
);

async function list() {
  const { data, error } = await supabaseAdmin.from('global_settings').select('settings_key, settings_value');
  console.log('global_settings keys:', data?.map(d => d.settings_key));
  const analytics = data?.find(d => d.settings_key.includes('analytic') || d.settings_key.includes('admin') || d.settings_key.includes('phone'));
  if (analytics) console.log('Found:', analytics);
}

list();
