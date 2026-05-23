"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { X, Calendar, Layers, Loader2, Plus } from "lucide-react";
import { useProject } from "@/features/projects/hooks/useProject";

export interface SprintFormData {
  title: string;
  startDate: string;
  endDate: string;
}

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPending?: boolean;
  nextSprintNumber?: number;
}

export default function CreateSprintModal({
  isOpen,
  onClose,
  isPending = false,
  nextSprintNumber = 1,
}: CreateSprintModalProps) {
  const params = useParams();
  const projectId = params?.id as string;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SprintFormData>();

  const startDateValue = watch("startDate");

  const { useCreateSprintByProject } = useProject();

  const { mutate: createSprint, isPending: creatingSprint } =
    useCreateSprintByProject(projectId);

  const handleFormSubmit = async (data: SprintFormData) => {
    const payload = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      order: nextSprintNumber,
    };

    createSprint(payload, {
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
      <div className="relative w-full max-w-md bg-white border border-zinc-200 shadow-2xl rounded-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <Layers className="h-4.5 w-4.5" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-zinc-900">
                Spawn Sprint Milestone
              </h2>

              <p className="text-xs text-zinc-400">
                Deploy a sequential timebox container sequence.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-md">
            Sequence #{nextSprintNumber}
          </span>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-5 space-y-4 bg-zinc-50/30"
        >
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Sprint Identifier Title
            </label>

            <input
              type="text"
              placeholder="e.g., Q3 Payment Gateway Hardening"
              {...register("title", {
                required: "Sprint title descriptor cannot be empty",
              })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white"
            />

            {errors.title && (
              <p className="text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                Start Cycle
              </label>

              <input
                type="date"
                {...register("startDate", {
                  required: "Start date required",
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white"
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
                End Boundary
              </label>

              <input
                type="date"
                {...register("endDate", {
                  required: "End date required",
                  validate: (value) =>
                    !startDateValue ||
                    new Date(value) >= new Date(startDateValue) ||
                    "End date must be after start date",
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white"
              />

              {errors.endDate && (
                <p className="text-xs text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2 bg-white -mx-5 -mb-5 p-4">
            <button
              type="button"
              onClick={onClose}
              disabled={creatingSprint}
              className="px-3.5 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creatingSprint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg"
            >
              {creatingSprint ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Initialize Milestone
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
