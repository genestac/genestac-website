import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = "https://www.genestac.com";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function extractTextFromLayout(contentLayout: any[]): string {
  if (!Array.isArray(contentLayout)) return "";
  const parts: string[] = [];
  for (const block of contentLayout) {
    if (block.type === "text" && block.data?.html) {
      parts.push(stripHtml(block.data.html));
    } else if (block.type === "heading" && block.data?.text) {
      parts.push(block.data.text);
    }
  }
  return parts.join(" ").slice(0, 500);
}

export async function GET() {
  try {
    const { data: blogs, error } = await supabaseAdmin
      .from("blogs")
      .select("id, title, slug, meta_description, og_image, published_at, created_at, content_layout, focus_keywords")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(50);

    if (error) {
      return new NextResponse("Error fetching blogs", { status: 500 });
    }

    const items = (blogs || [])
      .map((blog) => {
        const pubDate = new Date(blog.published_at || blog.created_at).toUTCString();
        const link = `${BASE_URL}/blogs/${blog.slug}`;
        const description =
          blog.meta_description ||
          extractTextFromLayout(blog.content_layout) ||
          "Read the full article on Genestac Therapeutics.";

        const imageTag = blog.og_image
          ? `<enclosure url="${escapeXml(blog.og_image)}" type="image/jpeg" length="0" />`
          : "";

        const keywords = blog.focus_keywords?.join(", ") || "";

        return `
    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
      <author>editorial@genestac.com (Genestac Therapeutics)</author>
      ${keywords ? `<category>${escapeXml(keywords)}</category>` : ""}
      ${imageTag}
    </item>`;
      })
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Genestac Therapeutics — Health Insights</title>
    <link>${BASE_URL}</link>
    <description>Evidence-based articles on regenerative medicine, weight loss, stem cell therapy, and holistic health from Genestac Therapeutics, Gurugram.</description>
    <language>en-IN</language>
    <managingEditor>editorial@genestac.com (Genestac Therapeutics)</managingEditor>
    <webMaster>tech@genestac.com (Genestac Tech)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/api/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/logo2.png</url>
      <title>Genestac Therapeutics</title>
      <link>${BASE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("RSS feed error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
