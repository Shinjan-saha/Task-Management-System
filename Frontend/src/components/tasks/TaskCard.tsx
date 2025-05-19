
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { Task, deleteTask, updateTask } from "@/services/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskCardProps {
  task: Task;
  onTaskUpdate: () => void;
}

const TaskCard = ({ task, onTaskUpdate }: TaskCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/tasks/${task.ID}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteTask(task.ID);
      if (response.success) {
        toast.success("Task deleted successfully");
        onTaskUpdate();
      }
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleTaskCompletion = async () => {
    setIsUpdating(true);
    try {
      const response = await updateTask(task.ID, { completed: !task.Completed });
      if (response.success) {
        toast.success(`Task marked as ${!task.Completed ? "completed" : "incomplete"}`);
        onTaskUpdate();
      }
    } catch (error) {
      console.error("Update task error:", error);
      toast.error("Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className={`task-card overflow-hidden ${task.Completed ? "opacity-70" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Checkbox 
              checked={task.Completed} 
              onCheckedChange={toggleTaskCompletion}
              disabled={isUpdating}
              className="border-2"
            />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-medium mb-1 ${task.Completed ? "line-through text-muted-foreground" : ""}`}>
              {task.Title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mb-2">
                {task.description}
              </p>
            )}
            <div className="text-xs text-muted-foreground">
              Created: {format(new Date(task.CreatedAt), "MMM dd, yyyy")}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 flex justify-end space-x-2 bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="h-8"
        >
          <Edit className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="h-8"
            >
              <Trash className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
