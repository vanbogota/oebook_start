import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getAccessTokenFromRequest, validateSupabaseAccessToken } from "./lib/serverAuth";

const intlMiddleware = createMiddleware(routing);
const localeSet = new Set<string>(routing.locales);

const isProtectedPage = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const [maybeLocale, route] = segments;

  if (!maybeLocale || !localeSet.has(maybeLocale)) {
    return false;
  }

  return route === "profile";
};

const getLocaleFromPath = (pathname: string) => {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && localeSet.has(first)) {
    return first;
  }

  return routing.defaultLocale;
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/private/")) {
    const token = getAccessTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = await validateSupabaseAccessToken(token);
    if (!validation.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  if (isProtectedPage(pathname)) {
    const token = getAccessTokenFromRequest(request);
    if (!token) {
      const locale = getLocaleFromPath(pathname);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${locale}/restore`;
      redirectUrl.searchParams.set("redirectTo", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(redirectUrl);
    }

    const validation = await validateSupabaseAccessToken(token);
    if (!validation.valid) {
      const locale = getLocaleFromPath(pathname);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${locale}/restore`;
      redirectUrl.searchParams.set("redirectTo", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/api/private/:path*", "/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
