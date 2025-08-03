"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { useAuth } from "@/features/auth/hooks/useAuthCookie";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSession from "../hooks/useSession";

const loginFormSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { login, isLoading } = useAuth();
  const { login, isLoading } = useSession();
  const [error, setError] = useState<string>("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setError("");
      const success = await login({ email: values.email, password: values.password });
      if (success) {
        const from = searchParams.get("from");
        const redirectTo = from || "/projects";
        router.push(redirectTo);
      } else {
        setError("メールアドレスまたはパスワードが正しくありません");
      }
    } catch (_error) {
      setError("ログイン中にエラーが発生しました");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
        <CardDescription>ここにメールアドレスとパスワードをいれるとログインできる。スゴい</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-red-500 text-sm dark:text-red-400">{error}</div>}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
          {isLoading ? "ログイン中..." : "ログイン"}
        </Button>
        <div className="text-center text-gray-600 text-sm dark:text-gray-400">
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            こちらから登録
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
