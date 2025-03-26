import dbConnect from "@/app/lib/mongodb";
import Todo from "@/app/models/Todo";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const todos = await Todo.find({});
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  await dbConnect();
  const { title } = await req.json();
  const newTodo = await Todo.create({ title });
  return NextResponse.json(newTodo, { status: 201 });
}
