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
      pathname.startsWith("/orders") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/addresses") ||
      pathname.startsWith("/payment") ||
      pathname.startsWith("/profile-page")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (!userRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userRole === UserRole.STAFF_WAREHOUSE) {
    if (!pathname.startsWith("/inventories")) {
      return NextResponse.redirect(new URL("/inventories", request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (![UserRole.SUPERADMIN, UserRole.ADMIN].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
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

  if (pathname.startsWith("/profile-page")) {
    if (![UserRole.CUSTOMER].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/featured")) {
    if (![UserRole.CUSTOMER].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/addresses")) {
    if (![UserRole.CUSTOMER].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/payment")) {
    if (![UserRole.CUSTOMER].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/brands")) {
    if (
      request.method !== "GET" &&
      ![UserRole.SUPERADMIN, UserRole.ADMIN].includes(userRole)
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/categories")) {
    if (
      request.method !== "GET" &&
      ![UserRole.SUPERADMIN, UserRole.ADMIN].includes(userRole)
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/promotions")) {
    if (
      request.method !== "GET" &&
      ![UserRole.SUPERADMIN, UserRole.ADMIN].includes(userRole)
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/products")) {
    const isProductDetailRoute = pathname.match(
      /\/products\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );

    if (isProductDetailRoute && ![UserRole.CUSTOMER].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      pathname.includes("/create") ||
      pathname.includes("/edit") ||
      request.method !== "GET"
    ) {
      if (![UserRole.SUPERADMIN, UserRole.ADMIN].includes(userRole)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  if (pathname.startsWith("/inventories")) {
    if (
      ![UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.STAFF_WAREHOUSE].includes(
        userRole
      )
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/users/:path*",
    "/admin/:path*",
    "/orders/:path*",
    "/cart/:path*",
    "/products/:path*",
    "/addresses/:path*",
    "/brands/:path*",
    "/categories/:path*",
    "/promotions/:path*",
    "/payment/:path*",
    "/inventory/:path*",
    "/inventories/:path*",
    "/profile-page/:path*",
    "/featured/:path*",
  ],
};
