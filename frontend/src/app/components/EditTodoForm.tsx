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
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-lg border-l-4 border-wakaba-green">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
          Task
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-wakaba-green"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-wakaba-green"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-2">
          Deadline
        </label>
        <input
          type="date"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-wakaba-green"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-2">
          Project
        </label>
        <input
          type="text"
          id="project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-wakaba-green"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-wakaba-green text-gray-900 rounded-md hover:bg-wakaba-green-dark focus:outline-none focus:ring-2 focus:ring-wakaba-green"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}

