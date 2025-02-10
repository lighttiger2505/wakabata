"use client"

import { useState } from "react"
import type { Todo } from "./TodoList"

interface EditTodoFormProps {
  todo: Todo
  onSave: (updatedTodo: Todo) => void
  onCancel: () => void
}

export default function EditTodoForm({ todo, onSave, onCancel }: EditTodoFormProps) {
  const [title, setTitle] = useState(todo.title)
  const [tags, setTags] = useState(todo.tags.join(", "))
  const [deadline, setDeadline] = useState(todo.deadline || "")
  const [project, setProject] = useState(todo.project || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...todo,
      title,
      tags: tags.split(",").map((tag) => tag.trim()),
      deadline: deadline || undefined,
      project: project || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border-wakaba-green border-l-4 bg-gray-800 p-4 shadow-lg">
      <div className="mb-4">
        <label htmlFor="title" className="mb-2 block font-medium text-gray-300 text-sm">
          Task
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-wakaba-green"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="tags" className="mb-2 block font-medium text-gray-300 text-sm">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-wakaba-green"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="deadline" className="mb-2 block font-medium text-gray-300 text-sm">
          Deadline
        </label>
        <input
          type="date"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-wakaba-green"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="project" className="mb-2 block font-medium text-gray-300 text-sm">
          Project
        </label>
        <input
          type="text"
          id="project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-wakaba-green"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-wakaba-green px-4 py-2 text-gray-900 hover:bg-wakaba-green-dark focus:outline-none focus:ring-2 focus:ring-wakaba-green"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}

