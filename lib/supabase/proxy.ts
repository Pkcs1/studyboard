import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pages anyone can open without logging in.
const PUBLIC_PATHS = ["/login", "/styleguide"];

/**
 * Runs before every page (see proxy.ts):
 * 1. Refreshes the login session cookie so you stay signed in.
 * 2. Sends logged-out visitors to /login.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          // Stop CDNs from caching a response that carries someone's session.
          Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
        },
      },
    },
  );

  // getClaims() verifies the token. Never trust getSession() on the server.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);
  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

  if (!isLoggedIn && !isPublic) return redirectKeepingCookies("/login", request, supabaseResponse);
  if (isLoggedIn && path === "/login") return redirectKeepingCookies("/personal", request, supabaseResponse);

  // Must return this exact response so refreshed cookies reach the browser.
  return supabaseResponse;
}

/** A redirect that still carries the refreshed session cookies and cache headers. */
function redirectKeepingCookies(to: string, request: NextRequest, from: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = to;
  url.search = "";
  const response = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(header);
    if (value) response.headers.set(header, value);
  }
  return response;
}
