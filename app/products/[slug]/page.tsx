import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";
import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: product } = await supabase
    .from("inventory")
    .select("name, description, image_url, id, slug, requires_prescription, category, manufacturer")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!product) {
    return { title: "Product Not Found" };
  }

  const url = `https://www.genestac.com/products/${product.slug || product.id}`;
  const title = product.requires_prescription 
    ? `${product.name} | Uses, Information & Prescription | Genestac`
    : `${product.name} | Genestac`;
  
  // Use a customized description for medical products if applicable, otherwise fallback
  const description = product.requires_prescription 
    ? `Learn about ${product.name}, including product information, approved uses, safety information, storage and prescription requirements. Available through Genestac.`
    : (product.description || `Buy ${product.name} at Genestac.`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: product.image_url ? [{ url: product.image_url, alt: `${product.name} by ${product.manufacturer || "Genestac"}` }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
    alternates: {
      canonical: url,
    }
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

  // Fetch approved reviews server-side for initial render + schema
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: reviewsData } = await serviceSupabase
    .from("product_reviews")
    .select("id, created_at, reviewer_name, rating, title, body, verified_purchase, helpful_count")
    .eq("inventory_id", product.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  const approvedReviews = reviewsData || [];
  const totalReviews = approvedReviews.length;
  const avgRating = totalReviews > 0
    ? Math.round((approvedReviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10) / 10
    : 0;
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  approvedReviews.forEach(r => { distribution[r.rating] = (distribution[r.rating] || 0) + 1; });

  const url = `https://www.genestac.com/products/${product.slug || product.id}`;
  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.image_url ? [product.image_url] : undefined,
    sku: product.sku || undefined,
    brand: {
      "@type": "Brand",
      name: product.manufacturer || "Genestac Labs",
    },
    ...(totalReviews > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toString(),
        reviewCount: totalReviews.toString(),
        bestRating: "5",
        worstRating: "1",
      },
      review: approvedReviews.slice(0, 5).map(r => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.reviewer_name },
        reviewRating: { "@type": "Rating", ratingValue: r.rating.toString(), bestRating: "5" },
        reviewBody: r.body,
        datePublished: r.created_at.split("T")[0],
      })),
    }),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
      seller: {
        "@type": "Organization",
        name: "Genestac",
      },
      ...(product.compare_at_price && product.compare_at_price > product.price
        ? { priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] }
        : {}),
    },
    ...(product["Condition/Symptoms"] && {
      additionalProperty: (Array.isArray(product["Condition/Symptoms"])
        ? product["Condition/Symptoms"]
        : [product["Condition/Symptoms"]]
      ).map((s: string) => ({
        "@type": "PropertyValue",
        name: "Condition/Symptoms",
        value: s,
      })),
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.genestac.com/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://www.genestac.com/products"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: url
      }
    ]
  };

  const faqJsonLd = product.faqs && Array.isArray(product.faqs) && product.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faqs.map((faq: any) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <ProductDetailClient
        product={product}
        variants={variants || []}
        initialReviews={approvedReviews}
        initialAggregate={{ avg_rating: avgRating, total_count: totalReviews, distribution }}
      />
    </>
  );
}
