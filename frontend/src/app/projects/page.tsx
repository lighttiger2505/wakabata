"use client";

import AddProjectForm from "@/features/project-list/components/AddProjectForm";
import ProjectList from "@/features/project-list/components/ProjectList";

export default function Projects() {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <h2 className="mb-4 font-bold text-2xl text-green-400">Projects</h2>
      <AddProjectForm />
      <ProjectList />
    </div>
  );
}
