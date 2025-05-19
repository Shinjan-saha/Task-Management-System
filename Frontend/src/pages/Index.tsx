
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { isAuthenticated } from "@/services/api";
import { Check } from "lucide-react"; // Import the Check icon

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to tasks page if already authenticated
    if (isAuthenticated()) {
      navigate("/tasks");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 items-center">
          {/* Hero content */}
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Simplify Your Task Management
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Organize, track, and complete tasks efficiently with our intuitive task management system.
              Stay productive and focused on what matters most.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              <div className="bg-white/80 dark:bg-gray-800/80 shadow-sm rounded-lg px-4 py-2 flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Easy task tracking</span>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 shadow-sm rounded-lg px-4 py-2 flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Secure authentication</span>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 shadow-sm rounded-lg px-4 py-2 flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Simple and intuitive</span>
              </div>
            </div>
          </div>
          
          {/* Auth Form */}
          <div className="w-full md:w-auto">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
