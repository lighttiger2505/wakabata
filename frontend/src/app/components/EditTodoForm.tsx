"use client";

// import type { Todo } from "./TodoList";
import type { Task } from "@/api/generated/model";
import { useState } from "react";

interface EditTodoFormProps {
  todo: Task;
  onSave: (updatedTodo: Task) => void;
  onCancel: () => void;
}

export default function EditTodoForm({ todo, onSave, onCancel }: EditTodoFormProps) {
  const [title, setTitle] = useState(todo.name);
  // const [tags, setTags] = useState(todo.tags.join(", "));
  const [deadline, setDeadline] = useState(todo.due_date || "");
  const [project, setProject] = useState(todo.project_id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...todo,
      // title,
      // tags: tags.split(",").map((tag) => tag.trim()),
      due_date: deadline || undefined,
      project_id: project || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border-green-400 border-l-4 bg-gray-800 p-4 shadow-lg">
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
          className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="tags" className="mb-2 block font-medium text-gray-300 text-sm">
          Tags (comma-separated)
        </label>
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
          className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
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
          className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
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
          className="rounded-md bg-green-400 px-4 py-2 text-gray-900 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
