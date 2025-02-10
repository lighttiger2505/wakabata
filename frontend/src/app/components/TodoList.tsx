"use client";

import { useEffect, useState } from "react";
import EditTodoForm from "./EditTodoForm";
import TodoItem from "./TodoItem";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  tags: string[];
  deadline?: string;
  project?: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch todos from an API here
    setTodos([
      {
        id: "1",
        title: "Learn Next.js",
        completed: false,
        tags: ["learning", "web"],
        deadline: "2023-06-30",
        project: "Self-improvement",
      },
      {
        id: "2",
        title: "Build a TODO app",
        completed: false,
        tags: ["project", "web"],
        deadline: "2023-07-15",
        project: "Portfolio",
      },
    ]);
  }, []);

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const editTodo = (id: string) => {
    setEditingTodoId(id);
  };

  const saveTodo = (updatedTodo: Todo) => {
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
    setEditingTodoId(null);
  };

  const cancelEdit = () => {
    setEditingTodoId(null);
  };

  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <li key={todo.id}>
          {editingTodoId === todo.id ? (
            <EditTodoForm todo={todo} onSave={saveTodo} onCancel={cancelEdit} />
          ) : (
            <TodoItem todo={todo} onToggle={toggleTodo} onEdit={editTodo} />
          )}
        </li>
      ))}
    </ul>
  );
}
