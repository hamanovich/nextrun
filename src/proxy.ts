import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile"];

const SESSION_COOKIE = "better-auth.session_token";

export const proxy = (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !req.cookies.get(SESSION_COOKIE)) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
