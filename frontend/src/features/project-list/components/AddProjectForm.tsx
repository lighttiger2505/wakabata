"use client";

import { usePOSTApiV1Projects } from "@/api/generated/client";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { pOSTApiV1ProjectsBody } from "@/api/generated/zod/project/project.zod";

export const dateToRFC3339 = (date: Date | null | undefined) => {
  return date ? formatISO(date) : null;
};

export default function AddProjectForm() {
  const { trigger, error, isMutating } = usePOSTApiV1Projects();

  const model = pOSTApiV1ProjectsBody;
  type ProjectSchema = z.infer<typeof model>;

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(model),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: ProjectSchema) => {
    form.reset();
    trigger({
      name: values.name,
      description: values.description,
    });
  };

  if (error) {
    console.error(error);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-8 rounded-lg border-green-400 border-l-4 bg-gray-800 p-4 shadow-lg"
      >
        {/* Input name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="mb=4">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {/* Input description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="mb=4">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || undefined} placeholder="" />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isMutating}
          className="w-full rounded-md bg-green-400 px-4 py-2 text-gray-900 hover:bg-bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Create New Project
        </Button>
      </form>
    </Form>
  );
}
