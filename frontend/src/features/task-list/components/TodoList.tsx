"use client";

import { useGETApiV1Tasks } from "@/api/generated/client";
import { Task } from "@/api/generated/model";
import { useState } from "react";
import EditTodoForm from "./EditTodoForm";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { data, isLoading, mutate } = useGETApiV1Tasks();
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  if (!data || isLoading) return <p>Loading</p>;
  if (!data.length) return <p>Nop</p>;

  const onStartEdit = (id: string) => {
    setEditingTodoId(id);
  };

  const onEditMutate = async (updatedTask: Task | undefined) => {
    if (updatedTask) {
      const updatedData = data.map((task: Task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task));
      await mutate(updatedData, false);
    }
  };

  const onDeleteMutate = async (id: string) => {
    const updatedData = data.filter((item: Task) => item.id !== id);
    await mutate(updatedData, false);
  };

  const onCloseEdit = async (updatedTask: Task | undefined) => {
    setEditingTodoId(null);
    await onEditMutate(updatedTask);
  };

  return (
    <ul className="space-y-4">
      {data.map((todo) => (
        <li key={todo.id}>
          {editingTodoId === todo.id ? (
            <EditTodoForm todo={todo} onCloseAction={onCloseEdit} />
          ) : (
            <TodoItem todo={todo} onStartEdit={onStartEdit} onDeleteAction={onDeleteMutate} onEditAction={onEditMutate} />
          )}
        </li>
      ))}
    </ul>
  );
}
