
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskList from "@/components/tasks/TaskList";
import { isAuthenticated } from "@/services/api";

const TasksPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your tasks</p>
        </div>
        <Button onClick={() => navigate("/tasks/new")} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>
      
      <TaskList />
    </div>
  );
};

export default TasksPage;
