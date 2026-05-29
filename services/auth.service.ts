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
    try {
      const response = await axiosInstance.post("/api/auth/v1/login", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (data: SignupInput) => {
    try {
      const response = await axiosInstance.post("/api/auth/v1/signup", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/api/auth/v1/logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await axiosInstance.post("/api/auth/v1/refresh-token");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async (token: string) => {
    try {
      const response = await axiosInstance.get(`/api/auth/v1/verify-email?token=${token}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMe: async () => {
    try {
      const response = await axiosInstance.get("/api/auth/v1/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};