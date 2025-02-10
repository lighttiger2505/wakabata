import TodoList from "./components/TodoList"
import AddTodoForm from "./components/AddTodoForm"

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-wakaba-green">Your Tasks</h2>
      <AddTodoForm />
      <TodoList />
    </div>
  )
}

