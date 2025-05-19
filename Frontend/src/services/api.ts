import axios from 'axios';
import { toast } from '@/components/ui/sonner';

const API_URL = 'https://task-management-system-production-b62d.up.railway.app';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Task {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  Title: string;
  Completed: boolean;
  UserID: number;
  description?: string;
  status?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  completed?: boolean;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const getToken = (): string | null => localStorage.getItem('token');
export const setToken = (token: string): void => localStorage.setItem('token', token);
export const removeToken = (): void => localStorage.removeItem('token');
export const isAuthenticated = (): boolean => !!getToken();

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header if token exists
axiosInstance.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register
export const register = async (data: RegisterData): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/register', data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Registration error:', error);
    toast.error(error.response?.data?.error || 'Registration failed');
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

// Login
export const login = async (data: LoginData): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/login', data);
    setToken(response.data.token);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Login error:', error);
    toast.error(error.response?.data?.error || 'Login failed');
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

// Get tasks
export const getTasks = async (): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.get('/tasks');
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Get tasks error:', error);
    toast.error(error.response?.data?.error || 'Failed to fetch tasks');
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

// Create task
export const createTask = async (data: CreateTaskData): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/tasks', data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Create task error:', error);
    toast.error(error.response?.data?.error || 'Failed to create task');
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

// Update task
export const updateTask = async (taskId: number, data: UpdateTaskData): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.put(`/tasks/${taskId}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Update task error:', error);
    toast.error(error.response?.data?.error || 'Failed to update task');
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

// Delete task
export const deleteTask = async (taskId: number): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.delete(`/tasks/${taskId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Delete task error:', error);
    toast.error(error.response?.data?.error || 'Failed to delete task');
    return { success: false, error: error.response?.data?.error || error.message };
  }
};
