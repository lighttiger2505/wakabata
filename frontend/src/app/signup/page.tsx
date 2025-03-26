"use client";

import * as React from "react";

import { SignupForm } from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
