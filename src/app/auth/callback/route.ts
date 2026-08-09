import { NextResponse, type NextRequest } from "next/server";
import { createAuthedServerClient } from "@/lib/supabase/server";

function isSafeNextPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");
  const next = rawNext && isSafeNextPath(rawNext) ? rawNext : "/admin";

  if (code) {
    const supabase = await createAuthedServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login`);
}
