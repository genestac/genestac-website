import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary API keys not configured" },
        { status: 500 }
      );
    }

    // Generate SHA-1 signature
    // Cloudinary requires parameters to be sorted alphabetically.
    // Since we are only passing timestamp, it's just `timestamp=...`
    const stringToSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(stringToSign)
      .digest("hex");

    return NextResponse.json({
      timestamp,
      signature,
      api_key: apiKey,
    });
  } catch (error: any) {
    console.error("Error generating Cloudinary signature:", error);
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    );
  }
}
