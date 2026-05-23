"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "ON_HOLD";
export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
}

export interface Sprint extends BaseEntity {
  title: string;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  order: number;
  projectId?: string;
  project: Project;
  taskCount: number;
}
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const useBoard = () => {
  const queryClient = useQueryClient();
  const useGetAllSprints = () => {
    return useQuery({
      queryKey: ["sprints"],

      queryFn: async (): Promise<Sprint[]> => {
        const response =
          await api.get<ApiResponse<{ sprints: Sprint[] }>>("/sprints");

        return response.data.data.sprints;
      },

      staleTime: 1000 * 60 * 5, // 5 mins
    });
  };

  const useGetTaskBySprintId = (sprintId: string) => {
    return useQuery({
      queryKey: ["tasks", "sprint", sprintId],

      queryFn: async (): Promise<any[]> => {
        const { data } = await api.get<ApiResponse<{ tasks: any[] }>>(
          `/tasks/sprints/${sprintId}`,
        );

        return data.data.tasks;
      },

      enabled: !!sprintId,

      staleTime: 1000 * 60 * 5,
    });
  };

  const useCreateTaskBySprintId = (sprintId: string) => {
    return useMutation({
      mutationFn: async (payload: {
        title: string;
        description?: string;
        estimateHours?: number;
        dueDate?: string;
        priority?: "LOW" | "MEDIUM" | "HIGH";
        assignedIds?: string[];
      }) => {
        const { data } = await api.post<ApiResponse<{ task: any }>>(
          `/tasks/sprints/${sprintId}`,
          payload,
        );

        return data; // ✅ IMPORTANT FIX
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tasks", "sprint", sprintId], // ✅ better structure
        });
      },
    });
  };

  return {
    useGetAllSprints,
    useGetTaskBySprintId,
    useCreateTaskBySprintId,
  };
};
