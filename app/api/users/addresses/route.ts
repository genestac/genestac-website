import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      house_no,
      address_line_1,
      address_line_2,
      landmark,
      city,
      state,
      country,
      postal_code,
      is_default,
    } = body;

    if (!userId || !house_no || !address_line_1 || !city || !state || !postal_code) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: userId, house_no, address_line_1, city, state, postal_code" },
        { status: 400 },
      );
    }

    if (!/^\d{6}$/.test(postal_code)) {
      return NextResponse.json(
        { success: false, message: "Postal code must be a 6-digit number" },
        { status: 400 },
      );
    }

    if (is_default) {
      await supabaseAdmin
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", userId);
    }

    const { data, error } = await supabaseAdmin
      .from("addresses")
      .insert({
        user_id: userId,
        house_no,
        address_line_1,
        address_line_2: address_line_2 || "",
        landmark: landmark || "",
        city,
        state,
        country: country || "India",
        postal_code,
        is_default: is_default || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, userId, house_no, address_line_1, address_line_2, landmark, city, state, country, postal_code, is_default } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, message: "id and userId are required" },
        { status: 400 },
      );
    }

    if (postal_code && !/^\d{6}$/.test(postal_code)) {
      return NextResponse.json(
        { success: false, message: "Postal code must be a 6-digit number" },
        { status: 400 },
      );
    }

    if (is_default) {
      await supabaseAdmin
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", userId)
        .neq("id", id);
    }

    const updateFields: Record<string, any> = {};
    if (house_no !== undefined) updateFields.house_no = house_no;
    if (address_line_1 !== undefined) updateFields.address_line_1 = address_line_1;
    if (address_line_2 !== undefined) updateFields.address_line_2 = address_line_2;
    if (landmark !== undefined) updateFields.landmark = landmark;
    if (city !== undefined) updateFields.city = city;
    if (state !== undefined) updateFields.state = state;
    if (country !== undefined) updateFields.country = country;
    if (postal_code !== undefined) updateFields.postal_code = postal_code;
    if (is_default !== undefined) updateFields.is_default = is_default;

    const { data, error } = await supabaseAdmin
      .from("addresses")
      .update(updateFields)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
