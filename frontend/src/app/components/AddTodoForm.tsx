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

export default function AddTodoForm() {
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [project, setProject] = useState("");
  const projects = [
    {
      value: "p1",
      label: "Project Alpha",
    },
    {
      value: "p2",
      label: "Project Beta",
    },
    {
      value: "p3",
      label: "Project Gamma",
    },
    {
      value: "p4",
      label: "Project Delta",
    },
    {
      value: "p5",
      label: "Project Epsilon",
    },
  ] as SelectItemValue[];

  const handleDueDate = (d: Date | undefined) => setDueDate(d);

  const { trigger, error, isMutating } = usePOSTApiV1Tasks();

  type TaskSchema = z.infer<typeof pOSTApiV1TasksBody>;
  const form = useForm<TaskSchema>({
    resolver: zodResolver(pOSTApiV1TasksBody),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: TaskSchema) {
    trigger({
      name: values.name,
      due_date: values.due_date,
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
        <div className="mb-4">
          <Label
            htmlFor="dueDate"
            // className="mb-2 block font-medium text-gray-300 text-sm"
          >
            Duedate
          </Label>
          <DatePicker date={dueDate} setDate={handleDueDate} />
        </div>
        <div className="mb-4">
          <label htmlFor="project" className="mb-2 block font-medium text-gray-300 text-sm">
            Project
          </label>
          <SelectBox value={project} setValue={setProject} items={projects} placeholder={"Select your project."} />
        </div>
        <button
          type="submit"
          disabled={isMutating}
          className="w-full rounded-md bg-wakaba-green px-4 py-2 text-gray-900 hover:bg-wakaba-green-dark focus:outline-none focus:ring-2 focus:ring-wakaba-green focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Plant New Task 🌱
        </button>
      </form>
    </Form>
  );
}
