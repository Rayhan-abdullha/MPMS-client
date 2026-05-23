"use client";

import { useForm } from "react-hook-form";
import {
  X,
  Plus,
  Calendar,
  DollarSign,
  FolderPlus,
  Loader2,
} from "lucide-react";

import { useProject } from "@/features/projects/hooks/useProject";

export interface ProjectFormData {
  title: string;
  client: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: "planned" | "active" | "completed" | "archived";
  thumbnailUrl?: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const { createProject, isCreatingProject, errorText } = useProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      status: "planned",
      budget: 0,
    },
  });

  const handleFormSubmit = async (data: ProjectFormData) => {
    const formattedPayload = {
      ...data,

      budget: Number(data.budget) || 0,

      // convert date -> ISO string
      startDate: new Date(data.startDate).toISOString(),

      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,

      // backend field name
      thumbnail: data.thumbnailUrl || "",

      // status mapping
      status:
        data.status === "planned"
          ? "PLANNED"
          : data.status === "active"
            ? "ACTIVE"
            : data.status === "completed"
              ? "COMPLETED"
              : "ARCHIVED",
    };

    createProject(formattedPayload, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white border border-zinc-200 shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FolderPlus className="h-4.5 w-4.5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Create Project
              </h2>

              <p className="text-xs text-zinc-400">
                Initialize a new project workspace.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg cursor-pointer transition-colors outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/30"
        >
          {/* Error */}
          {errorText && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {errorText}
            </div>
          )}

          {/* Title + Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Project Title
              </label>

              <input
                type="text"
                placeholder="Project title"
                {...register("title", {
                  required: "Project title is required",
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />

              {errors.title && (
                <p className="text-xs text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Client
              </label>

              <input
                type="text"
                placeholder="Client name"
                {...register("client", {
                  required: "Client name is required",
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />

              {errors.client && (
                <p className="text-xs text-red-600">{errors.client.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Description
            </label>

            <textarea
              rows={3}
              placeholder="Project description..."
              {...register("description")}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                Start Date
              </label>

              <input
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />

              {errors.startDate && (
                <p className="text-xs text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                End Date
              </label>

              <input
                type="date"
                {...register("endDate")}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Budget + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
                Budget
              </label>

              <input
                type="number"
                placeholder="5000"
                {...register("budget", {
                  min: 0,
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Status
              </label>

              <select
                {...register("status")}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Thumbnail URL
            </label>

            <input
              type="url"
              placeholder="https://example.com/image.png"
              {...register("thumbnailUrl")}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3 bg-white -mx-6 -mb-6 p-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreatingProject}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreatingProject}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors disabled:bg-zinc-300"
            >
              {isCreatingProject ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
