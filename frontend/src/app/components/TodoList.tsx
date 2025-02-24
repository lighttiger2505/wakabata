"use client";

import { useGETApiV1Tasks } from "@/api/generated/client";
import { useState } from "react";
import EditTodoForm from "./EditTodoForm";
import TodoItem from "./TodoItem";
import { Task } from "@/api/generated/model";

export default function TodoList() {
  const { data, isLoading, mutate } = useGETApiV1Tasks();
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  if (!data || isLoading) return <p>Loading</p>;
  if (!data.length) return <p>Nop</p>;

  const onEdit = (id: string) => {
    setEditingTodoId(id);
  };

  const onCloseEdit = async (updatedTask: Task | undefined) => {
    setEditingTodoId(null);
    if (updatedTask) {
      const updatedData = data.map((item: Task) => (item.id === updatedTask.id ? { ...item, ...updatedTask } : item));
      await mutate(updatedData, false);
    }
  };

  return (
    <ul className="space-y-4">
      {data.map((todo) => (
        <li key={todo.id}>
          {editingTodoId === todo.id ? (
            <EditTodoForm todo={todo} onCloseAction={onCloseEdit} />
          ) : (
            <TodoItem todo={todo} onEdit={onEdit} listMutate={mutate} />
          )}
        </li>
      ))}
    </ul>
  );
}
