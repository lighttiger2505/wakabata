import { useDELETEApiV1TasksId, usePUTApiV1TasksId } from "@/api/generated/client";
import type { Task, TaskToUpdate } from "@/api/generated/model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isPast, parseISO } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

interface TodoItemProps {
  todo: Task;
  onStartEdit: (id: string) => void;
  onDeleteAction: (id: string) => void;
  onEditAction: (updatedTask: Task | undefined) => void;
}

export default function TodoItem({ todo, onStartEdit, onDeleteAction, onEditAction }: TodoItemProps) {
  const { trigger: editTrigger } = usePUTApiV1TasksId(todo.id || "");
  const { trigger: deleteTrigger } = useDELETEApiV1TasksId(todo.id || "");

  const toggleCompleted = async () => {
    // update the task status
    const body = {
      description: todo.description,
      due_date: todo.due_date,
      name: todo.name || "",
      priority: todo.priority,
      project_id: todo.project_id,
      status: !todo.status,
    } satisfies TaskToUpdate;
    await editTrigger(body);

    // update the task in the list
    const updatedTask = {
      ...todo,
      ...{ status: !todo.status },
    } satisfies Task;
    onEditAction(updatedTask);
  };

  const completed = todo.status || false;
  return (
    <div className="rounded-lg border-green-400 border-l-4 bg-gray-800 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex flex-grow items-center">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => toggleCompleted()}
            className="mr-4 h-5 w-5 rounded border-gray-300 text-green-400 focus:ring-green-600"
          />
          <span className={`flex-grow ${completed ? "text-gray-500 line-through" : "text-gray-100"}`}>{todo.name}</span>
        </div>
        <button
          type="button"
          onClick={() => onStartEdit(todo.id || "")}
          className="ml-2 p-1 text-gray-400 hover:text-green-400 focus:outline-none"
        >
          <Pencil size={16} />
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button type="button" className="ml-2 p-1 text-red-400 hover:text-red-800 focus:outline-none">
              <Trash2 size={16} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>タスクを削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。タスク「{todo.name}」を削除してもよろしいですか？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await deleteTrigger();
                  onDeleteAction(todo.id || "");
                }}
                className="bg-red-500 hover:bg-red-600"
              >
                削除する
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {todo.due_date && (
        <div className={`mt-2 text-sm ${isPast(parseISO(todo.due_date)) ? "font-bold text-red-500" : "text-yellow-400"}`}>
          Deadline: {todo.due_date}
        </div>
      )}
      {todo.project_id && <div className="mt-1 text-purple-400 text-sm">Project: {todo.project_id}</div>}
    </div>
  );
}
