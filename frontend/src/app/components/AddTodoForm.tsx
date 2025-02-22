"use client";

import { usePOSTApiV1Tasks } from "@/api/generated/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import DatePicker from "./DatePicker";
import SelectBox from "./SelectBox";
import { SelectItemValue } from "./SelectBox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { pOSTApiV1TasksBody } from "@/api/generated/zod/task/task.zod";
import { z } from "zod";
import { formatISO } from "date-fns";
import { Button } from "@/components/ui/button";

const dateToRFC3339 = (date: Date | null) => {
  return date ? formatISO(date) : null;
};

export default function AddTodoForm() {
  const [tags, setTags] = useState("");
  const projects = [
    {
      value: 1,
      label: "Project Alpha",
    },
    {
      value: 2,
      label: "Project Beta",
    },
    {
      value: 3,
      label: "Project Gamma",
    },
    {
      value: 4,
      label: "Project Delta",
    },
    {
      value: 5,
      label: "Project Epsilon",
    },
  ] as SelectItemValue[];

  const { trigger, error, isMutating } = usePOSTApiV1Tasks();

  const model = pOSTApiV1TasksBody.omit({ due_date: true }).extend({ due_date: z.date().nullable() });
  type TaskSchema = z.infer<typeof model>;

  const form = useForm<TaskSchema>({
    resolver: zodResolver(model),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: TaskSchema) {
    trigger({
      name: values.name,
      due_date: dateToRFC3339(values.due_date),
    });
  }

  if (error) {
    console.error(error);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-8 rounded-lg border-wakaba-green border-l-4 bg-gray-800 p-4 shadow-lg"
      >
        {/* Input title */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel
                  htmlFor="title"
                  // className="mb-2 block font-medium text-gray-300 text-sm"
                >
                  Title
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Draw the legendary sword from the pedestal." />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {/* Input tag */}
        <div className="mb-4">
          <Label
            htmlFor="tags"
            // className="mb-2 block font-medium text-gray-300 text-sm"
          >
            Tags (comma-separated)
          </Label>
          <Input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            // className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-wakaba-green"
            placeholder="e.g., urgent, project, learning"
          />
        </div>

        {/* Input dueDate */}
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel
                  htmlFor="title"
                  // className="mb-2 block font-medium text-gray-300 text-sm"
                >
                  Title
                </FormLabel>
                <FormControl>
                  <DatePicker value={field.value || undefined} onValueChange={field.onChange} />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {/* Input project */}
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="project">Project</FormLabel>
              <FormControl>
                <SelectBox
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  items={projects}
                  placeholder="Select your project."
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isMutating}
          className="w-full rounded-md bg-wakaba-green px-4 py-2 text-gray-900 hover:bg-wakaba-green-dark focus:outline-none focus:ring-2 focus:ring-wakaba-green focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Plant New Task 🌱
        </Button>
      </form>
    </Form>
  );
}
