import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-gray-700 p-4">
      <div className="mx-auto max-w-4xl">
        <ul className="flex space-x-6">
          <Link href="/" className="font-semibold text-gray-100 text-lg hover:text-green-400">
            Home
          </Link>
          <Link href="/projects" className="font-semibold text-gray-100 text-lg hover:text-green-400">
            Projects
          </Link>
          <Link href="/settings" className="font-semibold text-gray-100 text-lg hover:text-green-400">
            Settings
          </Link>
        </ul>
      </div>
    </nav>
  );
}
