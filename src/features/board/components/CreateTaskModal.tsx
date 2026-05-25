"use client";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "next/navigation";
import {
  X,
  Loader2,
  Plus,
  Users,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useBoard } from "../hooks/useBoard";
import { useUsers } from "@/features/user/hooks/useUsers";
import { Team } from "@/features/user/user.types";
import { useQueryClient } from "@tanstack/react-query";

export interface TaskFormData {
  title: string;
  description?: string;
  estimateHours?: number;
  dueDate?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignedIds?: string[];
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
}: CreateTaskModalProps) {
  const params = useParams();
  const sprintId = params?.slag as string;
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      priority: "MEDIUM",
      assignedIds: [],
    },
  });

  const selectedUsers = watch("assignedIds") || [];

  const { useCreateTaskBySprintId } = useBoard();

  const { mutate: createTask, isPending } = useCreateTaskBySprintId(sprintId);
  const { useGetTeams } = useUsers();
  const { data: team, isLoading } = useGetTeams();
  const toggleUser = (id: string) => {
    const exists = selectedUsers.includes(id);

    setValue(
      "assignedIds",
      exists ? selectedUsers.filter((u) => u !== id) : [...selectedUsers, id],
    );
  };

  const handleFormSubmit = (data: TaskFormData) => {
    const payload = {
      title: data.title,
      projectId,
      description: data.description,
      estimateHours: data.estimateHours
        ? Number(data.estimateHours)
        : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      priority: data.priority,
      assignedIds: data.assignedIds,
    };

    createTask(payload, {
      onSuccess: () => {
        queryClient.resetQueries();
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 antialiased animate-in fade-in duration-200">
      {/* Premium backdrop layer with fine blur glassmorphism */}
      <div
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[4px] transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal panel bounding container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header segment context */}
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              Create Task Workspace
            </h2>
            <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
              Add task parameters with assignment routes & internal priority
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form elements matrix */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 p-5 overflow-y-auto max-h-[calc(85vh-100px)] custom-scrollbar"
        >
          {/* Title input row */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Task Heading Title
            </label>

            <input
              {...register("title", {
                required: "Task title context signature is required",
              })}
              className={`w-full rounded-lg border px-3 py-2 text-xs font-semibold text-zinc-900 placeholder-zinc-400 outline-none transition-all ${
                errors.title
                  ? "border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                  : "border-zinc-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10"
              }`}
              placeholder="e.g., Optimize cryptographic verification hooks"
            />

            {errors.title && (
              <p className="text-[10px] font-medium text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3 text-red-500 shrink-0" />{" "}
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description text component */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Acceptance Criteria / Description
            </label>

            <textarea
              {...register("description")}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-800 placeholder-zinc-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 transition-all resize-none leading-relaxed"
              rows={3}
              placeholder="Provide a structural overview detailing explicit boundaries for this deliverable resource item..."
            />
          </div>

          {/* Effort Allocation Hours + Target Calendar Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <Clock className="h-3 w-3 text-zinc-400" /> Estimate (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                {...register("estimateHours")}
                placeholder="e.g., 12.5"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-zinc-400" /> Due Target Date
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 cursor-pointer outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 transition-all bg-white"
              />
            </div>
          </div>

          {/* Priority lane tier drop container */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Priority Classification
            </label>

            <select
              {...register("priority")}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 transition-all cursor-pointer"
            >
              <option value="LOW">Low Level Task</option>
              <option value="MEDIUM">Medium Standard Bucket</option>
              <option value="HIGH">High Urgent Escalation</option>
            </select>
          </div>

          {/* Team Target Assignees Selection Stack */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <Users className="h-3.5 w-3.5 text-zinc-400" />
              Allocate Team Assignees
            </div>

            <div className="space-y-1.5 mt-2 bg-zinc-50 p-2 border border-zinc-200/60 rounded-xl max-h-[160px] overflow-y-auto custom-scrollbar">
              {isLoading && (
                <p className="text-[10px] font-medium text-zinc-400">
                  Loading...
                </p>
              )}

              {team!.map((u: Team) => {
                const active = selectedUsers.includes(u.id);

                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => toggleUser(u.id)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-[11px] font-semibold transition-all cursor-pointer select-none outline-none ${
                      active
                        ? "border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-xs ring-1 ring-indigo-600/10"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                    }`}
                  >
                    <span className="truncate">{u.email}</span>

                    {active && (
                      <span className="text-[9px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-md tracking-wider shadow-xs scale-95 transition-transform animate-in zoom-in-90 duration-100 shrink-0">
                        ACTIVE ASSIGNEE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer operational trigger block */}
          <div className="flex justify-end items-center gap-2 border-t border-zinc-100 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer outline-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="min-w-[110px] flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-xs font-bold text-white transition-colors cursor-pointer shadow-sm outline-none px-4 py-2"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Commit Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
