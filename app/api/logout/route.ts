// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: Request) {
  const cookie = serialize("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // Expire immediately
    path: "/"
  });

  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
  response.headers.set("Set-Cookie", cookie);
  return response;
}
