// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes: { [key: string]: string[] } = {
  "/dashboard": ["admin", "manager", "user"],
  "/admin": ["admin"],
  "/manager": ["manager"],
  "/api/admin/users": ["admin"] // Protect admin API
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const url = req.nextUrl.pathname;

  if (!token) {
    if (Object.keys(protectedRoutes).some((route) => url.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const authSecret = process.env.AUTH_SECRET;
    if (!authSecret) throw new Error("AUTH_SECRET not defined");

    const decoded = jwt.verify(token, authSecret) as {
      userId: string;
      role: string;
    };
    const allowedRoles = protectedRoutes[url] || [];

    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/manager/:path*",
    "/api/admin/users/:path*"
  ]
};
