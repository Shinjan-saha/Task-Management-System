
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateTaskData, Task, UpdateTaskData, createTask, getTasks, updateTask } from "@/services/api";

// Form validation schema
const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: z.string().optional(),
  completed: z.boolean().default(false),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const isEditMode = !!id;

  // Initialize form
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      completed: false,
    },
  });

  // Fetch task data if in edit mode
  useEffect(() => {
    const fetchTask = async () => {
      if (isEditMode) {
        setIsLoading(true);
        try {
          const response = await getTasks();
          if (response.success && Array.isArray(response.data)) {
            const foundTask = response.data.find((t: Task) => t.ID === Number(id));
            if (foundTask) {
              setTask(foundTask);
              form.reset({
                title: foundTask.Title,
                description: foundTask.description || "",
                status: foundTask.status || "pending",
                completed: foundTask.Completed,
              });
            } else {
              toast.error("Task not found");
              navigate("/tasks");
            }
          }
        } catch (error) {
          console.error("Fetch task error:", error);
          toast.error("Failed to fetch task");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTask();
  }, [id, isEditMode, navigate, form]);

  // Handle form submission
  const onSubmit = async (data: TaskFormValues) => {
    setIsLoading(true);
    try {
      if (isEditMode && task) {
        // Update existing task
        const updateData: UpdateTaskData = {
          title: data.title,
          description: data.description,
          status: data.status,
          completed: data.completed,
        };

        const response = await updateTask(task.ID, updateData);
        if (response.success) {
          toast.success("Task updated successfully");
          navigate("/tasks");
        }
      } else {
        // Create new task
        const createData: CreateTaskData = {
          title: data.title,
          description: data.description,
          status: data.status,
        };

        const response = await createTask(createData);
        if (response.success) {
          toast.success("Task created successfully");
          navigate("/tasks");
        }
      }
    } catch (error) {
      console.error("Task form error:", error);
      toast.error(isEditMode ? "Failed to update task" : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Task" : "Create New Task"}</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the details of your task"
            : "Add a new task to your list"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && isEditMode ? (
          <div className="space-y-4">
            <div className="h-10 w-full shimmer rounded-md"></div>
            <div className="h-24 w-full shimmer rounded-md"></div>
            <div className="h-10 w-1/2 shimmer rounded-md"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Task description (optional)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEditMode && (
                <FormField
                  control={form.control}
                  name="completed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mark as completed</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/tasks")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                    ? "Update Task"
                    : "Create Task"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskForm;
