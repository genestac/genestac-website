import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { persistSession: false } }
);

async function list() {
  const { data, error } = await supabaseAdmin.from('admin_analytics').select('*').limit(1);
  console.log('admin_analytics:', data, error);
}

list();
