import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const TAGS = [
  "site-content",
  "blog-posts",
  "testimonials",
  "pricing-plans",
  "faq-items",
  "team-members",
  "public-profiles",
];

export async function POST() {
  for (const tag of TAGS) {
    revalidateTag(tag);
  }
  return NextResponse.json({ revalidated: TAGS });
}
