import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./lib/enums/user-role.enum";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  });

  const userRole: UserRole = (token as any)?.role;
  const { pathname } = request.nextUrl;

  if (!token) {
    if (
      pathname.startsWith("/users") ||
      pathname.startsWith("/cart") ||
      pathname.startsWith("/orders")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (!userRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/users")) {
    if (![UserRole.SUPERADMIN, UserRole.ADMIN].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/cart")) {
    if (![UserRole.CUSTOMER].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/orders")) {
    if (![UserRole.CUSTOMER].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/products")) {
    if (
      pathname.match(/\/products\/[^/]+$/) &&
      ![UserRole.CUSTOMER].includes(userRole)
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*", "/orders/:path*", "/cart/:path*", "/products/:path*"],
};