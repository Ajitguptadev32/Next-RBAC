"use client";
import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";

export default function Homepage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo })
    });
    setNewTodo("");
    fetchTodos();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 bg-gray-400 backdrop-blur-md shadow-lg rounded-lg relative z-20">
      <h1 className="text-2xl font-bold mb-4">TODO App</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-1 rounded-lg"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New task..."
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {todos.map((todo: any) => (
          <TodoItem
            key={todo._id}
            id={todo._id}
            title={todo.title}
            completed={todo.completed}
            refreshTodos={fetchTodos} // ✅ Make sure this function is passed
          />
        ))}
      </div>
    </div>
  );
}
