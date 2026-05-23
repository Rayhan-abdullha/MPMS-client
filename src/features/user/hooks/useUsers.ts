"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { Team } from "../user.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const useUsers = () => {
  const queryClient = useQueryClient();

  const useGetTeams = () => {
    return useQuery<Team[]>({
      queryKey: ["team-members"],
      queryFn: async () => {
        const response = await api.get<ApiResponse<{ teams: Team[] }>>(
          "/users/team-members",
        );

        return response.data.data.teams;
      },
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    useGetTeams,
  };
};
