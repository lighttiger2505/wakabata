"use client";

import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
