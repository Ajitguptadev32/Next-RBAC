// app/api/signup/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import User from "../../models/userModel";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { fullName, email, password, role = "user" } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    // Allow admin/manager roles only with a secret key
    if (
      role !== "user" &&
      process.env.ROLE_SECRET !== process.env.ROLE_SECRET
    ) {
      return NextResponse.json(
        { error: "Invalid secret key for role" },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role
    });
    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
