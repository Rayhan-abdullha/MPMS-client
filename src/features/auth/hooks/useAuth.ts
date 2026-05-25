"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { LoginPayload, RegisterPayload, AuthResponse } from "../auth.types";
import { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorText, setErrorText] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      setErrorText(null);
      const { data } = await api.post<AuthResponse>("/auth/login", payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success("Login successful!");
      localStorage.setItem("mpms_user", JSON.stringify(response.data.user));
      localStorage.setItem("mpms_auth_token", response.data.accessToken);
      Cookies.set("mpms_auth_token", JSON.stringify(response?.data.user));
      Cookies.set("mpms_auth_token", response?.data.accessToken);
      queryClient.setQueryData(["current_user"], response.data.user);
      router.push("/dashboard/projects");
    },
    onError: (err: any) => {
      toast.error("Credentials invalid. Please try again.");
      setErrorText(
        err.response?.data?.message || "Invalid email or password parameters.",
      );
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      setErrorText(null);
      const { data } = await api.post<AuthResponse>("/auth/register", payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success("Registration successful!");
      router.push("/auth/login");
    },
    onError: (err: any) => {
      toast.error("Registration failed");
      setErrorText(
        err.response?.data?.message ||
          "Registration failed. Email might already be taken.",
      );
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      toast.success("Logout successful!");
      localStorage.removeItem("mpms_user");
      localStorage.removeItem("mpms_auth_token");
      Cookies.remove("mpms_auth_token");
      Cookies.remove("mpms_user");
      queryClient.setQueryData(["current_user"], null);
      queryClient.removeQueries();
      router.push("/auth/login");
    },
    onError: () => {
      toast.error("Logout failed. Please try again.");
      console.error("Logout failed. Please try again.");
    },
  });

  return {
    login: loginMutation,
    registerMutation,
    logout,
    errorText,
  };
};
