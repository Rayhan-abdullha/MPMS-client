"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { X, Calendar, Layers, Loader2, Plus } from "lucide-react";

export interface SprintFormData {
  title: string;
  startDate: string;
  endDate: string;
}

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SprintFormData) => Promise<void>;
  isPending?: boolean;
  nextSprintNumber?: number; // Passed dynamically from the backend state tracking matrix
}

export default function CreateSprintModal({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
  nextSprintNumber = 1,
}: CreateSprintModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SprintFormData>();

  const startDateValue = watch("startDate");

  const handleFormSubmit = async (data: SprintFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Structural Backdrop Dimmer layer */}
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Main Core Form Card Wrapper */}
      <div className="relative w-full max-w-md bg-white border border-zinc-200 shadow-2xl rounded-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Module Header Segment */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
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

        {/* Form Validation Canvas Layer */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-5 space-y-4 bg-zinc-50/30"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Sprint Identifier Title
            </label>
            <input
              type="text"
              placeholder="e.g., Q3 Payment Gateway Hardening"
              {...register("title", {
                required:
                  "Sprint title descriptor cannot map to an empty string",
              })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
            {errors.title && (
              <p className="text-xs text-red-600 font-semibold">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Start Cycle
              </label>
              <input
                type="date"
                {...register("startDate", {
                  required: "Timeline start validation rules required",
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
                <Calendar className="h-3.5 w-3.5 text-zinc-400" /> End Boundary
              </label>
              <input
                type="date"
                {...register("endDate", {
                  required: "Timeline termination criteria required",
                  validate: (value) =>
                    !startDateValue ||
                    new Date(value) >= new Date(startDateValue) ||
                    "End target must drop subsequent to or on the start execution node",
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

          {/* Action Control Panel Base Bar */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2 bg-white -mx-5 -mb-5 p-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-3.5 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg transition-colors cursor-pointer outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors outline-none cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Initialize Milestone
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
