"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      router.push("/dashboard/projects");
    },

    onError: (err: any) => {
      console.error("Project creation error:", err);
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
        queryClient.invalidateQueries({
          queryKey: ["sprints", projectId],
        });
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
