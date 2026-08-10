import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const TAGS = [
  "site-content",
  "blog-posts",
  "testimonials",
  "pricing-plans",
  "faq-items",
  "team-members",
  "public-profiles",
];

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  for (const tag of TAGS) {
    revalidateTag(tag, { expire: 0 });
  }
  return NextResponse.json({ revalidated: TAGS });
}
