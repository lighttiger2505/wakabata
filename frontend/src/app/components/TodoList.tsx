"use client";

import { useGETApiV1Tasks } from "@/api/generated/client";
import type { Task } from "@/api/generated/model";
import { useState } from "react";
import EditTodoForm from "./EditTodoForm";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { data, isLoading, mutate } = useGETApiV1Tasks();
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  if (!data || isLoading) return <p>Loading</p>;
  if (!data.length) return <p>Nop</p>;

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
      {data.map((todo) => (
        <li key={todo.id}>
          {editingTodoId === todo.id ? (
            <EditTodoForm todo={todo} onSave={saveTodo} onCancel={cancelEdit} />
          ) : (
            <TodoItem todo={todo} onEdit={editTodo} listMutate={mutate} />
          )}
        </li>
      ))}
    </ul>
  );
}
