import AddTodoForm from "@/features/task-list/components/AddTodoForm";
import TodoList from "@/features/task-list/components/TodoList";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <h2 className="mb-4 font-bold text-2xl text-green-400">Tasks</h2>
      <AddTodoForm />
      <TodoList />
    </div>
  );
}
