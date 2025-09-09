import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./enums/user-role.enum";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  });
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const userRole = (token as any)?.role as string | undefined;
  if (!userRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/dashboard")) {
    if (userRole !== UserRole.SUPERADMIN) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
