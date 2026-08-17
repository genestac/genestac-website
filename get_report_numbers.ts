import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { persistSession: false } }
);

async function list() {
  const { data, error } = await supabaseAdmin.from('global_settings').select('settings_value').eq('settings_key', 'whatsapp_report_numbers');
  console.log('whatsapp_report_numbers:', data);
}

list();
