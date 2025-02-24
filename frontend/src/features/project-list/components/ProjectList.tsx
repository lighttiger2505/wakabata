"use client";

import { useGETApiV1Projects } from "@/api/generated/client";

export default function TodoList() {
  const { data, isLoading } = useGETApiV1Projects();

  if (!data || isLoading) return <p>Loading</p>;
  if (!data.length) return <p>Nop</p>;

  return (
    <ul className="space-y-4">
      {data.map((project) => (
        <li key={project.id}>
          {project.id} {project.name}
        </li>
      ))}
    </ul>
  );
}
