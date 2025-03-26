import dbConnect from "@/app/lib/mongodb";
import Todo from "@/app/models/Todo";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  if (!params.id) {
    return NextResponse.json({ error: "Todo ID is required" }, { status: 400 });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      params.id,
      await req.json(),
      { new: true }
    );

    if (!updatedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  if (!params.id) {
    return NextResponse.json({ error: "Todo ID is required" }, { status: 400 });
  }

  try {
    const deletedTodo = await Todo.findByIdAndDelete(params.id);

    if (!deletedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
