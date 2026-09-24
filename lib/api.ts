import axios from "axios";
import { getSession } from "next-auth/react";
import type { ApiResponse, DashboardStats, Job, Product, User } from "@/types";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTPUBLICBASEURL || "http://localhost:5002/api/v1";

export const api = axios.create({ baseURL, timeout: 20000 });

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const session = await getSession();
    if (session?.accessToken) config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export const authApi = {
  login: (payload: { email: string; password: string }) => api.post<ApiResponse<User & { accessToken: string; refreshToken: string }>>("/auth/login", payload).then(r => r.data),
  forgotPassword: (email: string) => api.post<ApiResponse<null>>("/auth/forgot-password", { email }).then(r => r.data),
  verifyResetOtp: (email: string, otp: string) => api.post<ApiResponse<null>>("/auth/verify-reset-otp", { email, otp }).then(r => r.data),
  resendOtp: (email: string) => api.post<ApiResponse<null>>("/auth/resend-otp", { email }).then(r => r.data),
  resetPassword: (payload: { email: string; otp: string; password: string; confirmPassword: string }) => api.post<ApiResponse<null>>("/auth/reset-password", payload).then(r => r.data),
  logout: () => api.post<ApiResponse<null>>("/auth/logout").then(r => r.data),
};

export const dashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardStats>>("/jobs/dashboard").then(r => r.data.data),
};

export type ListParams = { page?: number; limit?: number; search?: string; status?: string };

export const jobsApi = {
  list: (params: ListParams) => api.get<ApiResponse<Job[]>>("/jobs", { params }).then(r => r.data),
  get: (id: string) => api.get<ApiResponse<Job>>(`/jobs/${id}`).then(r => r.data.data),
  remove: (id: string) => api.delete<ApiResponse<null>>(`/jobs/${id}`).then(r => r.data),
};

export const staffApi = {
  list: (params: ListParams) => api.get<ApiResponse<User[]>>("/staff", { params }).then(r => r.data),
  get: (id: string) => api.get<ApiResponse<User>>(`/staff/${id}`).then(r => r.data.data),
  create: (data: FormData) => api.post<ApiResponse<User>>("/staff", data).then(r => r.data),
  toggle: (id: string) => api.patch<ApiResponse<User>>(`/staff/${id}/toggle-status`).then(r => r.data),
  remove: (id: string) => api.delete<ApiResponse<null>>(`/staff/${id}`).then(r => r.data),
};

export const productsApi = {
  list: (params: ListParams) => api.get<ApiResponse<Product[]>>("/products/admin-catalog", { params }).then(r => r.data),
  get: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`).then(r => r.data.data),
  create: (data: FormData) => api.post<ApiResponse<Product>>("/products", data).then(r => r.data),
  update: (id: string, data: FormData) => api.patch<ApiResponse<Product>>(`/products/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete<ApiResponse<null>>(`/products/${id}`).then(r => r.data),
};

export const userApi = {
  profile: () => api.get<ApiResponse<User>>("/user/profile").then(r => r.data.data),
  update: (data: FormData) => api.patch<ApiResponse<User>>("/user/profile", data).then(r => r.data),
  changePassword: (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) => api.patch<ApiResponse<null>>("/user/change-password", payload).then(r => r.data),
};
