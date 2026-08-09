import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest, isAdminHost = false) {
  const rawPathname = request.nextUrl.pathname;

  if (isAdminHost && !rawPathname.startsWith("/admin")) {
    const entryUrl = request.nextUrl.clone();
    entryUrl.pathname = `/admin${rawPathname === "/" ? "" : rawPathname}`;
    return NextResponse.redirect(entryUrl);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = rawPathname.startsWith("/admin");
  const isLoginRoute = rawPathname === "/admin/login";
  const isPublicAuthRoute =
    isLoginRoute || rawPathname === "/admin/mot-de-passe-oublie";

  if (isAdminRoute && !isPublicAuthRoute && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}
