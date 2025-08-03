"use client";

import { Button } from "@/components/ui/button";
import useSession from "@/features/auth/hooks/useSession";
import Link from "next/link";

export default function Header() {
  const { logout, isLoggedIn } = useSession();

  return (
    <header className="bg-gray-800 p-4 text-green-400">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div>
          <h1 className="flex items-center font-bold text-3xl">
            <Link href="/" className="flex items-center">
              <span className="mr-2">🍃</span> WakabaTa
            </Link>
          </h1>
          <p className="text-gray-400">Nurture your tasks, grow your productivity</p>
        </div>

        {isLoggedIn && (
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => logout()} className="text-green-400 hover:text-green-500">
              ログアウト
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
