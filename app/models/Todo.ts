import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ITodo extends Document {
  _id: string; // Explicitly define _id
  title: string;
  completed: boolean;
}

const TodoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

export default models.Todo || model<ITodo>("Todo", TodoSchema);
