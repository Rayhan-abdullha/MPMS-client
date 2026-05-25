"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { LoginPayload, RegisterPayload, AuthResponse } from "../auth.types";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

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
      localStorage.setItem("mpms_user", JSON.stringify(response.data.user));
      queryClient.setQueryData(["current_user"], response.data.user);
      router.push("/dashboard/projects");
    },
    onError: (err: any) => {
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
      router.push("/auth/login");
    },
    onError: (err: any) => {
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
      console.log("Logout successful");
      localStorage.removeItem("mpms_user");
      queryClient.setQueryData(["current_user"], null);
      router.push("/auth/login");
    },
    onError: () => {
      console.error("Logout failed. Please try again.");
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout: logout.mutate,
    errorText,
  };
};
