"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BASE_URL = process.env. Backend_URL;

export default function TaskManagerApp() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLogin, setIsLogin] = useState(true);

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
   

  };

  const handleRegister = async () => {
    try {
      await axios.post(`${BASE_URL}/register`, {
        name,
        email,
        password,
      });
      toast.success("Registered Successfully");
      setIsLogin(true);
    } catch {
      toast.error("Registration Failed");
    }
  };

 const handleLogin = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    });
    setToken(res.data.token);
    toast.success("Login Successful");
  } catch {
    toast.error("Login Failed");
  }
};

  const createTask = async () => {
    try {
      await axios.post(
        `${BASE_URL}/tasks`,
        { title, description, status: "pending" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Task Created");
      fetchTasks();
    } catch {
      toast.error("Task Creation Failed");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task Deleted");
      fetchTasks();
    } catch {
      toast.error("Delete Failed");
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);
console.log("BASE_URL = ", BASE_URL);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Toaster />
      <h1 className="text-3xl font-bold text-center mb-6">
        Task Management App
      </h1>
      <Card className="mb-4">
        <CardContent className="p-4">
          {!token ? (
            <>
              {!isLogin && (
                <div className="mb-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                </div>
              )}
              <div className="mb-2">
                <Label>Email</Label>
                <Input value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
              </div>
              <div className="mb-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={isLogin ? handleLogin : handleRegister}>
                  {isLogin ? "Login" : "Register"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Switch to Register" : "Switch to Login"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
              </div>
              <div className="mb-2">
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                />
              </div>
              <Button onClick={createTask}>Add Task</Button>
              <div className="mt-4 space-y-2">
                {tasks.map((task) => (
                  <Card key={task.ID} className="bg-slate-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{task.Title}</p>
                          <p className="text-sm text-gray-500">
                            Status: {task.Completed ? "Completed" : "Pending"}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => deleteTask(task.ID)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
