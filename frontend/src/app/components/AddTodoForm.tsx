"use client";

import { usePOSTApiV1Tasks } from "@/api/generated/client";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SelectBox from "./SelectBox";
import { SelectItemValue } from "./SelectBox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { pOSTApiV1TasksBody } from "@/api/generated/zod/task/task.zod";
import { z } from "zod";
import { format, formatISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const dateToRFC3339 = (date: Date | null) => {
  return date ? formatISO(date) : null;
};

export default function AddTodoForm() {
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
      description: values.description,
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
        className="mb-8 rounded-lg border-green-400 border-l-4 bg-gray-800 p-4 shadow-lg"
      >
        {/* Input title */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel
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

        {/* Input description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || undefined} placeholder="" />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {/* Input dueDate */}
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        {/* Input project */}
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
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
          className="w-full rounded-md bg-green-400 px-4 py-2 text-gray-900 hover:bg-bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Plant New Task 🌱
        </Button>
      </form>
    </Form>
  );
}
