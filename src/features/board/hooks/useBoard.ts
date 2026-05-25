"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "ON_HOLD";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

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
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  project: Project;
  taskCount: number;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  user: { name: string; email: string };
  text: string;
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}
export type ActivityType =
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_ASSIGNED"
  | "TASK_STATUS_CHANGED"
  | "COMMENT_CREATED"
  | "ATTACHMENT_UPLOADED";
export interface ActivityLogResponse {
  id: string;
  type: ActivityType;
  description: string | null;
  taskId: string | null;
  userId: string;
  createdAt: string | Date; // Date if directly from Prisma, string if serialized via API response
  user: {
    name: string | null;
    email: string;
  };
}

export interface Task extends BaseEntity {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimateHours?: number;
  dueDate?: string;
  sprintId: string;
  assignedUsers?: Array<{ id: string; name: string; email: string }>;
  comments: Comment[];
  activities: ActivityLogResponse[];
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
      staleTime: 1000 * 60 * 5,
    });
  };

  const useGetTaskBySprintId = (sprintId: string) => {
    return useQuery({
      queryKey: ["tasks", "sprint", sprintId],
      queryFn: async (): Promise<Task[]> => {
        const { data } = await api.get<ApiResponse<{ tasks: Task[] }>>(
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
        priority?: TaskPriority;
        assignedIds?: string[];
      }) => {
        const { data } = await api.post<ApiResponse<{ task: Task }>>(
          `/tasks/sprints/${sprintId}`,
          payload,
        );

        return data.data.task;
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tasks", "sprint", sprintId],
        });
      },
    });
  };
  const useUpdateTaskStatus = (sprintId: string) => {
    return useMutation({
      mutationFn: async ({
        taskId,
        status,
      }: {
        taskId: string;
        status: TaskStatus;
      }) => {
        const { data } = await api.patch<ApiResponse<{ task: Task }>>(
          `/tasks/${taskId}/status`,
          { status },
        );
        return data.data.task;
      },
      onMutate: async ({ taskId, status }) => {
        await queryClient.cancelQueries({
          queryKey: ["tasks", "sprint", sprintId],
        });
        const previousTasks = queryClient.getQueryData<Task[]>([
          "tasks",
          "sprint",
          sprintId,
        ]);

        if (previousTasks) {
          queryClient.setQueryData<Task[]>(
            ["tasks", "sprint", sprintId],
            previousTasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
          );
        }
        return { previousTasks };
      },
      onError: (err, variables, context) => {
        if (context?.previousTasks) {
          queryClient.setQueryData(
            ["tasks", "sprint", sprintId],
            context.previousTasks,
          );
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tasks", "sprint", sprintId],
        });
        queryClient.invalidateQueries({
          queryKey: ["tasks", "assigned-to-me"],
        });
      },
    });
  };

  const getAssignedTask = () => {
    return useQuery({
      queryKey: ["tasks", "assigned-to-me"],
      queryFn: async (): Promise<any[]> => {
        const { data } = await api.get<ApiResponse<{ tasks: any[] }>>(
          "/tasks/assigned-to-me",
        );

        return data?.data.tasks;
      },
      staleTime: 1000 * 60 * 5,
    });
  };
  const useUpdateTaskDetails = (sprintId: string) => {
    return useMutation({
      mutationFn: async ({
        taskId,
        payload,
      }: {
        taskId: string;
        payload: Partial<Task>;
      }) => {
        const { data } = await api.put<ApiResponse<{ task: Task }>>(
          `/tasks/${taskId}`,
          payload,
        );
        return data.data.task;
      },
      onSuccess: (updatedTask) => {
        queryClient.invalidateQueries({
          queryKey: ["tasks", "sprint", sprintId],
        });
        queryClient.invalidateQueries({
          queryKey: ["tasks", "assigned-to-me"],
        });
      },
    });
  };

  const useDeleteTask = (sprintId: string) => {
    return useMutation({
      mutationFn: async (taskId: string) => {
        await api.delete(`/tasks/${taskId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tasks", "sprint", sprintId],
        });
      },
    });
  };

  // TODO
  const useAddComment = (sprintId: string, taskId: string) => {
    return useMutation({
      mutationFn: async (payload: { text: string; parentId?: string }) => {
        const { data } = await api.post<ApiResponse<{ comment: Comment }>>(
          `/tasks/${taskId}/comments`,
          payload,
        );
        return data.data.comment;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tasks", "sprint", sprintId],
        });
      },
    });
  };

  return {
    useGetAllSprints,
    useGetTaskBySprintId,
    useCreateTaskBySprintId,
    getAssignedTask,
    useUpdateTaskStatus,
    // should be implement
    useUpdateTaskDetails,
    useDeleteTask,
    useAddComment,
  };
};
