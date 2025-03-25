"use client";

import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center font-bold text-3xl">ログイン</h1>
        <LoginForm />
      </div>
    </div>
  );
}
