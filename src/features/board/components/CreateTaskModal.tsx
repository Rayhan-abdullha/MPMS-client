"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { createTaskSchema, CreateTaskInput } from "../board.schema";
import { X, Loader2, Plus, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultColumnId?: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  defaultColumnId = "col-backlog",
}: CreateTaskModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      columnId: defaultColumnId,
      priority: "MEDIUM",
      title: "",
      description: "",
      assigneeName: "",
    },
  });

  // TanStack Mutation handling network delivery and state cache clearing
  const createTaskMutation = useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      // Swapping out mock state mutations with real endpoint pipelines
      const response = await api.post("/tasks", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate active board caches to trigger clean data refetches
      queryClient.invalidateQueries({ queryKey: ["workspace_projects"] });
      reset();
      onClose();
    },
    onError: (error: any) => {
      console.error("Task registration fault:", error);
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end animate-in fade-in duration-200">
      {/* Backdrop panel background shade */}
      <div
        className="absolute inset-0 bg-zinc-900/30 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Structural Slide-over Container */}
      <div className="relative w-full max-w-lg h-full bg-premium-card border-l border-premium-border shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Component Header Segment */}
        <div className="h-16 border-b border-premium-border px-6 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Initialize Task Card
            </h2>
            <p className="text-xs text-premium-textMuted">
              Inject standard tracking modules into active sprint pipelines.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg outline-none cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Dynamic Form Engine Entry Body */}
        <form
          id="task-generation-form"
          onSubmit={handleSubmit((data) => createTaskMutation.mutate(data))}
          className="flex-1 overflow-y-auto p-6 space-y-5 bg-zinc-50/40"
        >
          {createTaskMutation.isError && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Transmission Pipeline Fault:</span>{" "}
                An error occurred while pushing this card node to your remote
                server. Please verify your connection parameter logs.
              </div>
            </div>
          )}

          {/* Input Block: Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Task Title
            </label>
            <input
              type="text"
              placeholder="e.g., Architect Double-Entry Ledger Nodes"
              {...register("title")}
              className={clsx(
                "w-full px-3 py-2 text-sm rounded-lg border outline-none bg-white text-zinc-900 transition-all",
                errors.title
                  ? "border-red-300 focus:ring-1 focus:ring-red-400"
                  : "border-premium-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
              )}
            />
            {errors.title && (
              <p className="text-xs font-semibold text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Grid Selector Block: Priority & Column target destination parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Priority Weight
              </label>
              <select
                {...register("priority")}
                className="w-full px-3 py-2 text-sm rounded-lg border border-premium-border bg-white text-zinc-900 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer"
              >
                <option value="LOW">Low Velocity</option>
                <option value="MEDIUM">Medium Target</option>
                <option value="HIGH">High Priority</option>
                <option value="CRITICAL">Critical Path</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Sprint Column Destination
              </label>
              <select
                {...register("columnId")}
                className="w-full px-3 py-2 text-sm rounded-lg border border-premium-border bg-white text-zinc-900 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer"
              >
                <option value="col-backlog">Sprint Backlog</option>
                <option value="col-progress">In Progress</option>
                <option value="col-review">Code Review</option>
                <option value="col-done">Done / Verified</option>
              </select>
            </div>
          </div>

          {/* Input Block: Assignee Identity Tag */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Assignee Alias
            </label>
            <input
              type="text"
              placeholder="e.g., Rayhan"
              {...register("assigneeName")}
              className={clsx(
                "w-full px-3 py-2 text-sm rounded-lg border outline-none bg-white text-zinc-900 transition-all",
                errors.assigneeName
                  ? "border-red-300 focus:ring-1 focus:ring-red-400"
                  : "border-premium-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
              )}
            />
            {errors.assigneeName && (
              <p className="text-xs font-semibold text-red-600 mt-1">
                {errors.assigneeName.message}
              </p>
            )}
          </div>

          {/* Input Block: Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Detailed Technical Scope description
            </label>
            <textarea
              rows={5}
              placeholder="Describe dependencies, execution patterns, and clear acceptance validation metrics..."
              {...register("description")}
              className={clsx(
                "w-full px-3 py-2 text-sm rounded-lg border outline-none bg-white text-zinc-900 transition-all resize-none leading-relaxed",
                errors.description
                  ? "border-red-300 focus:ring-1 focus:ring-red-400"
                  : "border-premium-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
              )}
            />
            {errors.description && (
              <p className="text-xs font-semibold text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>

        {/* Action Panel Footer Row */}
        <div className="h-18 border-t border-premium-border px-6 flex items-center justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={createTaskMutation.isPending}
            className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-premium-border rounded-lg transition-colors cursor-pointer outline-none disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="task-generation-form"
            disabled={createTaskMutation.isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {createTaskMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Transmitting
                Node...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Deploy Task Card
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
s;
