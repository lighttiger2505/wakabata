import { useDELETEApiV1TasksId, usePUTApiV1TasksId } from "@/api/generated/client";
import type { Task, TaskToUpdate } from "@/api/generated/model";
import { Pencil, Trash2 } from "lucide-react";
import type { KeyedMutator } from "swr";

interface TodoItemProps {
  todo: Task;
  onEdit: (id: string) => void;
  listMutate: KeyedMutator<Task[]>;
}

export default function TodoItem({ todo, onEdit, listMutate }: TodoItemProps) {
  const { trigger: editTrigger } = usePUTApiV1TasksId(todo.id || "");
  const { trigger: deleteTrigger } = useDELETEApiV1TasksId(todo.id || "");

  const toggleTodo = async () => {
    const body = {
      description: todo.description,
      due_date: todo.due_date,
      name: todo.name || "",
      priority: todo.priority,
      project_id: todo.project_id,
      status: !todo.status,
    } satisfies TaskToUpdate;
    await editTrigger(body);
    await listMutate();
  };

  const completed = todo.status || false;
  return (
    <div className="rounded-lg border-green-400 border-l-4 bg-gray-800 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex flex-grow items-center">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => toggleTodo()}
            className="mr-4 h-5 w-5 rounded border-gray-300 text-green-400 focus:ring-green-600"
          />
          <span className={`flex-grow ${completed ? "text-gray-500 line-through" : "text-gray-100"}`}>{todo.name}</span>
        </div>
        <button
          type="button"
          onClick={() => onEdit(todo.id || "")}
          className="ml-2 p-1 text-gray-400 hover:text-green-400 focus:outline-none"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={async () => {
            await deleteTrigger();
            await listMutate();
          }}
          className="ml-2 p-1 text-red-400 hover:text-red-800 focus:outline-none"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {todo.due_date && <div className="mt-2 text-sm text-yellow-400">Deadline: {todo.due_date}</div>}
      {todo.project_id && <div className="mt-1 text-purple-400 text-sm">Project: {todo.project_id}</div>}
    </div>
  );
}
