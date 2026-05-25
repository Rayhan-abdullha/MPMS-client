"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export interface Project {
  _id: string;
  title: string;
  client: string;
  description?: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  thumbnail?: string;
  status?: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  title: string;
  client: string;
  description?: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  thumbnail?: string;
  status?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const useProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [errorText, setErrorText] = useState<string | null>(null);

  const createProjectMutation = useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      setErrorText(null);

      const { data } = await api.post<ApiResponse<Project>>(
        "/projects",
        payload,
      );

      return data;
    },

    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      router.push("/dashboard/projects");
    },

    onError: (err: any) => {
      toast.error("Project creation failed");
      setErrorText(err.response?.data?.message || "Project creation failed");
    },
  });

  const useDeleteProjectById = () => {
    return useMutation({
      mutationFn: async ({ projectId }: { projectId: string }) => {
        const { data } = await api.delete<ApiResponse<Project>>(
          `/projects/${projectId}`,
        );
        return data;
      },

      onSuccess: () => {
        toast.success("Project deleted successfully!");
        queryClient.invalidateQueries({
          queryKey: ["projects"],
        });
      },
    });
  };

  const useGetProjects = () => {
    return useQuery({
      queryKey: ["projects"],

      queryFn: async () => {
        const { data } =
          await api.get<ApiResponse<{ projects: Project[] }>>("/projects");

        return data.data;
      },
    });
  };
  const useGetSingleProject = (projectId: string) => {
    return useQuery({
      queryKey: ["project", projectId],

      queryFn: async () => {
        const { data } = await api.get<ApiResponse<Project>>(
          `/projects/${projectId}`,
        );

        return data.data;
      },

      enabled: !!projectId,
    });
  };

  const useCreateSprintByProject = (projectId: string) => {
    return useMutation({
      mutationFn: async (payload: {
        title: string;
        startDate: string;
        endDate: string;
      }) => {
        const { data } = await api.post<ApiResponse<{ sprint: any }>>(
          `/sprints/project/${projectId}`,
          payload,
        );
      },

      onSuccess: () => {
        toast.success("Sprint created successfully!");
        queryClient.invalidateQueries({
          queryKey: ["sprints", projectId],
        });
      },

      onError: (err: any) => {
        toast.error("Sprint creation failed");
        setErrorText(err.response?.data?.message || "Sprint creation failed");
      },
    });
  };

  const useGetSprintsByProject = (projectId: string) => {
    return useQuery({
      queryKey: ["sprints", projectId],

      queryFn: async () => {
        const { data } = await api.get<ApiResponse<{ sprints: any[] }>>(
          `/sprints/project/${projectId}`,
        );

        return data.data;
      },

      enabled: !!projectId,
    });
  };

  return {
    createProject: createProjectMutation.mutate,
    isCreatingProject: createProjectMutation.isPending,
    useGetProjects,
    useGetSingleProject,
    useGetSprintsByProject,
    useCreateSprintByProject,
    useDeleteProjectById,
    errorText,
  };
};
