import { useState } from "react";

type TodoProps = {
  id: string;
  title: string;
  completed: boolean;
  refreshTodos: () => void;
};

export default function TodoItem({
  id,
  title,
  completed,
  refreshTodos
}: TodoProps) {
  const [loading, setLoading] = useState(false);

  const toggleCompletion = async () => {
    setLoading(true);
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    });
    refreshTodos();
  };

  const deleteTodo = async () => {
    setLoading(true);
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    refreshTodos();
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <span className={`${completed ? "line-through text-gray-500" : ""}`}>
        {title}
      </span>
      <div className="flex gap-2">
        <button onClick={toggleCompletion} className="text-green-500">
          {completed ? "Undo" : "Done"}
        </button>
        <button onClick={deleteTodo} className="text-red-500">
          Delete
        </button>
      </div>
    </div>
  );
}
