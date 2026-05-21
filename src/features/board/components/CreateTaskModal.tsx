"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Clock,
  AlertCircle,
  FileText,
  Paperclip,
  Loader2,
  Plus,
} from "lucide-react";

export interface TaskFormData {
  title: string;
  description: string;
  assignees: string; // Comma-delimited text layout mapping into data arrays on serialization boundaries
  estimateHours: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TO DO" | "IN PROGRESS" | "REVIEW" | "DONE";
  dueDate: string;
  attachments?: FileList;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isPending?: boolean;
  teamMembers?: { id: string; name: string }[]; // Fed dynamically from the /team endpoints matrix
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
  teamMembers = [],
}: CreateTaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      priority: "MEDIUM",
      status: "TO DO",
      estimateHours: 1,
    },
  });

  const handleFormSubmit = async (data: TaskFormData) => {
    // Structural conversion converting text lines to multi-tenant array objects before passing across network paths
    const processingPayload = {
      ...data,
      estimateHours: Number(data.estimateHours) || 0,
      assignees: data.assignees
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    await onSubmit(processingPayload);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white border border-zinc-200 shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Component Title Segment Bar */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Provision Backlog Task
              </h2>
              <p className="text-xs text-zinc-400">
                Map executable deliverables down into sprint columns.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg cursor-pointer transition-colors outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Task Attribute Grid Configuration Elements Form context */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/30"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Task Title Header
            </label>
            <input
              type="text"
              placeholder="e.g., Integrate JWT Auth Middleware cookies routing"
              {...register("title", {
                required: "Task tracking header identifier required",
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
              Task Scope / Acceptance Criteria
            </label>
            <textarea
              rows={3}
              placeholder="State explicit edge cases, signature token lifecycles, and verification goals..."
              {...register("description", {
                required: "Explicit task description parameters required",
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
                <Clock className="h-3.5 w-3.5 text-zinc-400" /> Estimate
                Allocation (Hours)
              </label>
              <input
                type="number"
                placeholder="8"
                {...register("estimateHours", { required: true, min: 1 })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-zinc-400" /> Priority
                Weight Node
              </label>
              <select
                {...register("priority")}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 cursor-pointer appearance-none"
              >
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Standard</option>
                <option value="HIGH">Critical Escalation / High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Target Node Delivery Date
              </label>
              <input
                type="date"
                {...register("dueDate", {
                  required: "Due date completion criteria required",
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 cursor-pointer"
              />
              {errors.dueDate && (
                <p className="text-xs text-red-600 font-semibold">
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Assignee Vector Accounts
              </label>
              <input
                type="text"
                placeholder="e.g., Rayhan, Asif Rahman"
                {...register("assignees", {
                  required: "At least one worker target assignment is required",
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              {errors.assignees && (
                <p className="text-xs text-red-600 font-semibold">
                  {errors.assignees.message}
                </p>
              )}
            </div>
          </div>

          {/* Core File Asset Upload Gateway Portal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Reference Attachments (PDF / Image)
            </label>
            <div className="border-2 border-dashed border-zinc-200 rounded-lg p-4 bg-white text-center hover:border-zinc-300 transition-colors relative group">
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                {...register("attachments")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Paperclip className="h-5 w-5 text-zinc-400 mx-auto mb-1.5 group-hover:text-indigo-600 transition-colors" />
              <p className="text-xs font-medium text-zinc-600">
                Select local engineering documents or architecture layout
                renders
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Max footprint constraints apply per request block boundary
              </p>
            </div>
          </div>

          {/* Action Trigger base bar control group wrapper */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3 bg-white -mx-6 -mb-6 p-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg transition-colors cursor-pointer outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors outline-none cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Committing...
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Append To Sprint Backlog
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
