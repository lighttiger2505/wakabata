import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <h2 className="mb-4 font-bold text-2xl text-wakaba-green">Tasks</h2>
      <AddTodoForm />
      <TodoList />
    </div>
  );
}
