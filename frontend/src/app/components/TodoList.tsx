"use client";

import { useState } from "react";
import EditTodoForm from "./EditTodoForm";
import TodoItem from "./TodoItem";
import { useGETTasks } from "@/api/generated/client";
import type { Task } from "@/api/generated/model";

export default function TodoList() {
  const { data, error, isValidating } = useGETTasks();
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  if (error) {
    console.error(error);
    return <p>Error</p>;
  }
  if (!data || isValidating) return <p>Loading</p>;

  const todos: Task[] = data.data ?? [];
  if (!todos.length) return <p>Nop</p>;

  const toggleTodo = (_id: string) => {
    // setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const editTodo = (id: string) => {
    setEditingTodoId(id);
  };

  const saveTodo = (_updatedTodo: Task) => {
    // setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
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
