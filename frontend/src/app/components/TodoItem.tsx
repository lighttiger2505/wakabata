import type { Todo } from "./TodoList"
import { Pencil } from "lucide-react"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onEdit: (id: string) => void
}

export default function TodoItem({ todo, onToggle, onEdit }: TodoItemProps) {
  return (
    <div className="rounded-lg border-wakaba-green border-l-4 bg-gray-800 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex flex-grow items-center">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="mr-4 h-5 w-5 rounded border-gray-300 text-wakaba-green focus:ring-wakaba-green"
          />
          <span className={`flex-grow ${todo.completed ? "text-gray-500 line-through" : "text-gray-100"}`}>
            {todo.title}
          </span>
        </div>
        <button
          onClick={() => onEdit(todo.id)}
          className="ml-2 p-1 text-gray-400 hover:text-wakaba-green focus:outline-none"
        >
          <Pencil size={16} />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {todo.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-wakaba-green bg-gray-700 px-2 py-1 text-wakaba-green text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      {todo.deadline && <div className="mt-2 text-sm text-yellow-400">Deadline: {todo.deadline}</div>}
      {todo.project && <div className="mt-1 text-purple-400 text-sm">Project: {todo.project}</div>}
    </div>
  )
}

