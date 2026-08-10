import os
from supabase import create_client

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

if not url:
    with open('/home/Neelesh/Desktop/genestac-mobile/.env') as f:
        for line in f:
            if line.startswith('NEXT_PUBLIC_SUPABASE_URL='):
                url = line.split('=')[1].strip()
            if line.startswith('SUPABASE_SERVICE_ROLE_KEY='):
                key = line.split('=')[1].strip()

supabase = create_client(url, key)
res = supabase.table("coupons").select("*").execute()
print(res.data)
