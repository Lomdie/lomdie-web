import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware-client";

const ADMIN_HOST = "admin.lomdie.com";

export default async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0] ?? "";
  const isAdminHost = hostname === ADMIN_HOST;

  if (!isAdminHost && !request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  return updateSession(request, isAdminHost);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|api/|icon|opengraph-image|auth/).*)",
  ],
};
