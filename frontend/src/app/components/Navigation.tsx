import Link from "next/link"

export default function Navigation() {
  return (
    <nav className="bg-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        <ul className="flex space-x-6">
          <Link href="/" className="text-gray-100 hover:text-wakaba-green font-semibold text-lg">
            Home
          </Link>
          <Link href="/projects" className="text-gray-100 hover:text-wakaba-green font-semibold text-lg">
            Projects
          </Link>
          <Link href="/analytics" className="text-gray-100 hover:text-wakaba-green font-semibold text-lg">
            Analytics
          </Link>
          <Link href="/settings" className="text-gray-100 hover:text-wakaba-green font-semibold text-lg">
            Settings
          </Link>
        </ul>
      </div>
    </nav>
  )
}

