import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message:
        "This endpoint is deprecated. Use POST /api/payment/complete instead.",
    },
    { status: 410 },
  );
}
