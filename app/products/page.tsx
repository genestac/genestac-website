import { supabase } from "@/lib/supabase";
import { ProductsClient } from "./products-client";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products = [];
  
  try {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    products = data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to empty list or we could fall back to static data if needed
  }

  return <ProductsClient initialProducts={products} />;
}
