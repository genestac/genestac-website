import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Use service role to validate the anon-key session token
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // ── Auth: require a valid Supabase session ────────────────────────────────
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: "You must be logged in to submit a review." },
        { status: 401 }
      );
    }

    // Validate the token and get the authenticated user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Session expired or invalid. Please log in again." },
        { status: 401 }
      );
    }

    // ── Payload validation ────────────────────────────────────────────────────
    const body = await req.json();
    const { inventory_id, rating, title, body: reviewBody } = body;

    if (!inventory_id || !rating || !reviewBody) {
      return NextResponse.json(
        { error: "Missing required fields: inventory_id, rating, body" },
        { status: 400 }
      );
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }
    if (reviewBody.trim().length < 10) {
      return NextResponse.json({ error: "Review must be at least 10 characters" }, { status: 400 });
    }

    // ── Prevent duplicate reviews from the same user for the same product ─────
    const { data: existing } = await supabaseAdmin
      .from("product_reviews")
      .select("id, status")
      .eq("inventory_id", inventory_id)
      .eq("user_id", user.id)
      .limit(1);

    if (existing && existing.length > 0) {
      const existingStatus = existing[0].status;
      const msg =
        existingStatus === "pending"
          ? "You have already submitted a review for this product. It is awaiting moderation."
          : "You have already reviewed this product.";
      return NextResponse.json({ error: msg }, { status: 409 });
    }

    // ── Insert review as pending ──────────────────────────────────────────────
    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Anonymous";

    const { error: insertError } = await supabaseAdmin.from("product_reviews").insert({
      inventory_id,
      reviewer_name: displayName,
      reviewer_email: user.email || null,
      rating,
      title: title?.trim() || null,
      body: reviewBody.trim(),
      user_id: user.id,
      status: "pending",
    });

    if (insertError) {
      console.error("Review insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Review submitted. It will appear after our moderation team reviews it.",
    });
  } catch (e) {
    console.error("Review submission error:", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
