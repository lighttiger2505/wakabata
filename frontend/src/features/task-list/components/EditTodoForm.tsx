"use client";

import { useGETApiV1Projects, usePUTApiV1TasksId } from "@/api/generated/client";
import { Task } from "@/api/generated/model";
import { pUTApiV1TasksIdBody } from "@/api/generated/zod/task/task.zod";
import SelectBox, { SelectItemValue } from "@/components/SelectBox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { dateToRFC3339 } from "./AddTodoForm";

type EditTodoFormProps = {
  todo: Task;
  onCloseAction: (updatedTask: Task | undefined) => void;
};

export default function EditTodoForm({ todo, onCloseAction }: EditTodoFormProps) {
  const { trigger, error, isMutating } = usePUTApiV1TasksId(todo.id || "");
  const { data: projects, isLoading: isLoadingProjects } = useGETApiV1Projects();

  const projectItems: SelectItemValue<string>[] =
    projects?.map((project) => ({
      value: project.id || "",
      label: project.name || "",
    })) || [];

  const model = pUTApiV1TasksIdBody.omit({ due_date: true }).extend({ due_date: z.date().nullish() });
  type TaskSchema = z.infer<typeof model>;

  const form = useForm<TaskSchema>({
    resolver: zodResolver(model),
    defaultValues: {
      name: todo.name,
      description: todo.description,
      due_date: todo.due_date ? new Date(todo.due_date) : null,
      project_id: todo.project_id,
    },
  });

  const onSubmit = async (values: TaskSchema) => {
    // request to update the task
    const editTask = {
      name: values.name,
      description: values.description || undefined,
      due_date: dateToRFC3339(values.due_date),
      project_id: values.project_id || undefined,
    } satisfies Task;
    await trigger(editTask);

    // update the task in the list
    const updatedTask = {
      ...todo,
      ...editTask,
    } satisfies Task;
    onCloseAction(updatedTask);
  };

  if (error) {
    console.error(error);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border-green-400 border-l-4 bg-gray-800 p-4 shadow-lg">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="mb=4">
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
              <div className="mb=4">
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
              <div className="mb=4">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
              <div className="mb=4">
                <FormLabel>Project</FormLabel>
                <FormControl>
                  <SelectBox<string>
                    value={field.value || "" ? field.value || "" : "none"}
                    onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                    items={projectItems}
                    placeholder={isLoadingProjects ? "Loading projects..." : "Select your project."}
                    disabled={isLoadingProjects}
                    clearable
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            onClick={() => onCloseAction(undefined)}
            disabled={isMutating}
            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isMutating}
            className="rounded-md bg-green-400 px-4 py-2 text-gray-900 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
