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
  onSubmit: (data: ProjectFormData) => Promise<void>;
  isPending?: boolean;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
}: CreateProjectModalProps) {
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
    // Transform stringified numeric data gracefully back into standard numeric float structures
    const formattedPayload = {
      ...data,
      budget: Number(data.budget) || 0,
    };
    await onSubmit(formattedPayload);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Structural Modal Backdrop Screen click barrier */}
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Structural Central Control Card Form Container */}
      <div className="relative w-full max-w-xl bg-white border border-zinc-200 shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Form Modal Layout Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FolderPlus className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Provision Project Node
              </h2>
              <p className="text-xs text-zinc-400">
                Initialize a workspace context repository across sytem layers.
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

        {/* Dynamic Form Payload Elements Section */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/30"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Project Title
              </label>
              <input
                type="text"
                placeholder="e.g., Ledger Vault Core API"
                {...register("title", {
                  required: "Project title identifier context is required",
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              {errors.title && (
                <p className="text-xs text-red-600 font-semibold">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Corporate Client
              </label>
              <input
                type="text"
                placeholder="e.g., DataPollex Limited"
                {...register("client", {
                  required: "Client verification entity is required",
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              {errors.client && (
                <p className="text-xs text-red-600 font-semibold">
                  {errors.client.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Scope / Description Parameters
            </label>
            <textarea
              rows={3}
              placeholder="Detail overall technical baseline constraints, deployment milestones, and architecture rules..."
              {...register("description", {
                required: "Scope description context metrics are required",
              })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none leading-relaxed"
            />
            {errors.description && (
              <p className="text-xs text-red-600 font-semibold">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Start Cycle
                Date
              </label>
              <input
                type="date"
                {...register("startDate", {
                  required: "Initialization timeline marker required",
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 cursor-pointer"
              />
              {errors.startDate && (
                <p className="text-xs text-red-600 font-semibold">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" /> End Target
                Date
              </label>
              <input
                type="date"
                {...register("endDate", {
                  required: "Completion target metric required",
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 cursor-pointer"
              />
              {errors.endDate && (
                <p className="text-xs text-red-600 font-semibold">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-zinc-400" /> Financial
                Budget Capacity
              </label>
              <input
                type="number"
                placeholder="e.g., 65000"
                {...register("budget", {
                  required: "Financial point values are required",
                  min: 0,
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Operational Lifecycle State
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 cursor-pointer appearance-none"
              >
                <option value="planned">Planned Capacity</option>
                <option value="active">Active Execution</option>
                <option value="completed">Completed / Dispatched</option>
                <option value="archived">Archived Node</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Repository Thumbnail Vector URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.datapollex.com/vector-asset.png"
              {...register("thumbnailUrl")}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          {/* Form Action Controls Base Bar */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3 bg-white -mx-6 -mb-6 p-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg transition-colors cursor-pointer outline-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer select-none transition-colors outline-none disabled:bg-zinc-300"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                  Provisioning...
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Initialize Project Context
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
