const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.error("No url found");
  process.exit(1);
}

const supabase = createClient(url, key);
supabase.from("coupons").select("*").then(res => console.log(JSON.stringify(res.data, null, 2)));
