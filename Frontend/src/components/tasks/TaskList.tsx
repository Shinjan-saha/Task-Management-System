
import { useEffect, useState } from "react";
import { Task, getTasks } from "@/services/api";
import { toast } from "sonner";
import TaskCard from "./TaskCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, Search, X } from "lucide-react";

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await getTasks();
      if (response.success && Array.isArray(response.data)) {
        setTasks(response.data);
        setFilteredTasks(response.data);
      }
    } catch (error) {
      console.error("Fetch tasks error:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...tasks];

    // Search filter
    if (searchTerm) {
      result = result.filter((task) =>
        task.Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    switch (statusFilter) {
      case "completed":
        result = result.filter((task) => task.Completed);
        break;
      case "active":
        result = result.filter((task) => !task.Completed);
        break;
      // "all" shows everything
    }

    setFilteredTasks(result);
  }, [tasks, searchTerm, statusFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center relative flex-1">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 h-full"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          {(searchTerm || statusFilter !== "all") && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Tasks */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-36 shimmer rounded-lg"></div>
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.ID} task={task} onTaskUpdate={fetchTasks} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Check className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">No tasks found</h3>
          <p className="text-muted-foreground mt-1">
            {tasks.length > 0
              ? "Try adjusting your filters to find what you're looking for."
              : "Get started by creating your first task."}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
