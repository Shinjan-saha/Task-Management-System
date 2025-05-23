import { useState } from "react";
import { useNavigate } from "react-router-dom";
// REMOVED: import { zodResolver } from "@hookform/resolvers/zod";
// REMOVED: import { useForm } from "react-hook-form";
// REMOVED: import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginData, RegisterData, login, register } from "@/services/api";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  // Form validation errors
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  });
  
  const [registerErrors, setRegisterErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
    
    // Clear error when user types
    if (loginErrors[name]) {
      setLoginErrors({
        ...loginErrors,
        [name]: "",
      });
    }
  };
  
  // Handle register form changes
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({
      ...registerForm,
      [name]: value,
    });
    
    // Clear error when user types
    if (registerErrors[name]) {
      setRegisterErrors({
        ...registerErrors,
        [name]: "",
      });
    }
  };

  // Validate login form
  const validateLoginForm = () => {
    let isValid = true;
    const errors = { email: "", password: "" };
    
    if (!loginForm.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    if (!loginForm.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (loginForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    
    setLoginErrors(errors);
    return isValid;
  };
  
  // Validate register form
  const validateRegisterForm = () => {
    let isValid = true;
    const errors = { username: "", email: "", password: "" };
    
    if (!registerForm.username) {
      errors.username = "Username is required";
      isValid = false;
    } else if (registerForm.username.length < 2) {
      errors.username = "Username must be at least 2 characters";
      isValid = false;
    }
    
    if (!registerForm.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    if (!registerForm.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (registerForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    
    setRegisterErrors(errors);
    return isValid;
  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const loginData = {
        email: loginForm.email,
        password: loginForm.password,
      };

      const response = await login(loginData);
      if (response.success) {
        toast.success("Login successful!");
        navigate('/tasks');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const registerData = {
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
      };

      const response = await register(registerData);
      if (response.success) {
        toast.success("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between login and registration forms
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Register"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={loginForm.email}
                onChange={handleLoginChange}
              />
              {loginErrors.email && (
                <p className="text-sm text-red-500">{loginErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="******"
                value={loginForm.password}
                onChange={handleLoginChange}
              />
              {loginErrors.password && (
                <p className="text-sm text-red-500">{loginErrors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="John Doe"
                value={registerForm.username}
                onChange={handleRegisterChange}
              />
              {registerErrors.username && (
                <p className="text-sm text-red-500">{registerErrors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="register-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="register-email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={registerForm.email}
                onChange={handleRegisterChange}
              />
              {registerErrors.email && (
                <p className="text-sm text-red-500">{registerErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="register-password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="register-password"
                name="password"
                type="password"
                placeholder="******"
                value={registerForm.password}
                onChange={handleRegisterChange}
              />
              {registerErrors.password && (
                <p className="text-sm text-red-500">{registerErrors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          onClick={toggleAuthMode}
          className="w-full"
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Button>
      </CardFooter>
      </Card>
  );
};

export default AuthForm;