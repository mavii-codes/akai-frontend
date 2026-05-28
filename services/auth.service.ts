import axiosInstance from "@/lib/axios";
import { z } from "zod";

// Input types aligned with backend schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[0-9]/, "Must contain one number"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

export const authService = {
  login: async (data: LoginInput) => {
    const response = await axiosInstance.post("/api/auth/v1/login", data);
    return response.data;
  },

  signup: async (data: SignupInput) => {
    const response = await axiosInstance.post("/api/auth/v1/signup", data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/api/auth/v1/logout");
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post("/api/auth/v1/refresh-token");
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await axiosInstance.get(`/api/auth/v1/verify-email?token=${token}`);
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get("/api/auth/v1/me");
    return response.data;
  },
};