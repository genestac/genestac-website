import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Anon client — used to verify the user's JWT access token
function getAnonClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Service role client — used for admin operations (data deletion, auth.admin.deleteUser)
function getAdminClient() {
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: Request) {
  try {
    // 1. Extract Bearer token from Authorization header
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "").trim() ?? "";

    if (!token) {
      return NextResponse.json(
        { error: "Authentication token is required to delete account." },
        { status: 401 }
      );
    }

    // 2. Verify the token using the ANON client — this is the correct pattern
    //    used throughout this codebase (see /api/cart/route.ts)
    const anonClient = getAnonClient();
    const {
      data: { user },
      error: authError,
    } = await anonClient.auth.getUser(token);

    if (authError || !user) {
      console.error("Token verification failed:", authError?.message);
      return NextResponse.json(
        { error: "Invalid or expired authentication session." },
        { status: 401 }
      );
    }

    // 3. Use admin client for all destructive operations
    const admin = getAdminClient();
    const userId = user.id;
    const userEmail = user.email;
    const userPhone = user.phone;

    // Delete cart items
    await admin.from("cart").delete().eq("user_id", userId);

    // Delete patient profile rows (various FK patterns used in the codebase)
    await admin.from("patients").delete().eq("user_id", userId);
    await admin.from("patients").delete().eq("id", userId);
    if (userEmail) {
      await admin.from("patients").delete().eq("email", userEmail);
    }
    if (userPhone) {
      await admin.from("patients").delete().eq("phone", userPhone);
    }

    // Delete from users table (settings page queries from "users")
    await admin.from("users").delete().eq("id", userId);

    // Delete saved addresses
    await admin.from("user_addresses").delete().eq("user_id", userId);

    // Finally, delete the Supabase Auth user
    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error("Error deleting Supabase auth user:", deleteError);
      return NextResponse.json(
        { error: deleteError.message || "Failed to delete auth user." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account and associated data deleted successfully.",
    });
  } catch (error: any) {
    console.error("Account deletion exception:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
