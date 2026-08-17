import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: product } = await supabase
    .from("inventory")
    .select("name, description, image_url")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Genestac`,
    description: product.description || `Buy ${product.name} at Genestac.`,
    openGraph: {
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  // Fallback check: if slug matches UUID format, check ID instead (useful before slug migration completes)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedParams.slug);

  let query = supabase.from("inventory").select("*");
  
  if (isUuid) {
    query = query.eq("id", resolvedParams.slug);
  } else {
    query = query.eq("slug", resolvedParams.slug);
  }

  const { data: product, error } = await query.single();

  if (error || !product) {
    console.error("Product fetch error:", error);
    notFound();
  }

  const { data: variants } = await supabase
    .from("inventory_variants")
    .select("*")
    .eq("inventory_id", product.id)
    .order("created_at", { ascending: true });

  return <ProductDetailClient product={product} variants={variants || []} />;
}
