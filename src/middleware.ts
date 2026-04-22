import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/about", "/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const hasSession = Boolean(request.cookies.get("overflo_session")?.value);

  if (!isPublic && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "auth");
    return NextResponse.redirect(url);
  }

  if ((pathname === "/login" || pathname === "/signup") && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/feed";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
