// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import User from "../../../models/userModel";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authSecret = process.env.AUTH_SECRET;
    if (!authSecret) throw new Error("AUTH_SECRET not defined");

    const decoded = jwt.verify(token, authSecret) as {
      userId: string;
      role: string;
    };
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    const users = await User.find(
      {},
      "fullName email role createdAt updatedAt"
    );
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.cookies.get("session")?.value;
    const { userId, role } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authSecret = process.env.AUTH_SECRET;
    if (!authSecret) throw new Error("AUTH_SECRET not defined");

    const decoded = jwt.verify(token, authSecret) as {
      userId: string;
      role: string;
    };
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    if (!["admin", "manager", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role, updatedAt: new Date() },
      { new: true, select: "fullName email role" }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Role updated", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user role error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
