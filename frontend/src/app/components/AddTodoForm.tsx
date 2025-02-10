"use client"

import { useState } from "react"

export default function AddTodoForm() {
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [deadline, setDeadline] = useState("")
  const [project, setProject] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd send this data to an API
    console.log({
      title,
      tags: tags.split(",").map((tag) => tag.trim()),
      deadline: deadline || undefined,
      project: project || undefined,
    })
    // Reset form
    setTitle("")
    setTags("")
    setDeadline("")
    setProject("")
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-lg border-wakaba-green border-l-4 bg-gray-800 p-4 shadow-lg">
      <div className="mb-4">
        <label htmlFor="title" className="mb-2 block font-medium text-gray-300 text-sm">
          New Task
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-wakaba-green"
          placeholder="Plant a new task..."
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
          placeholder="e.g., urgent, project, learning"
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
          placeholder="e.g., Personal Growth, Work, Learning"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-wakaba-green px-4 py-2 text-gray-900 hover:bg-wakaba-green-dark focus:outline-none focus:ring-2 focus:ring-wakaba-green focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        Plant New Task 🌱
      </button>
    </form>
  )
}

