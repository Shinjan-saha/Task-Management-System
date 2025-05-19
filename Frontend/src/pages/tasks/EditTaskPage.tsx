
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "@/components/tasks/TaskForm";
import { isAuthenticated } from "@/services/api";

const EditTaskPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Edit Task</h1>
      <TaskForm />
    </div>
  );
};

export default EditTaskPage;
