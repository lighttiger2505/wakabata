"use client";

import { useLogin } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function SignupForm() {
  const router = useRouter();
  const { login: storeLogin } = useAuth();
  const { login: apiLogin, isLoading } = useLogin();
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
      const tokenPair = await apiLogin(values);
      if (tokenPair.access_token) {
        const success = await storeLogin(values.email, values.password);
        if (success) {
          router.push("/projects");
          return;
        }
      }
      setError("メールアドレスまたはパスワードが正しくありません");
    } catch (_error) {
      setError("ログイン中にエラーが発生しました");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>アカウント登録</CardTitle>
        <CardDescription>ここにメールアドレスとパスワードをいれるととってもいいことがおきる。かもしれない</CardDescription>
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
      <CardFooter className="flex justify-between">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "ログイン中..." : "ログイン"}
        </Button>
      </CardFooter>
    </Card>
  );
}
