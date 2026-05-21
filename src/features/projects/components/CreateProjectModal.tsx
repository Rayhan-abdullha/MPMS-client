"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { X, Plus, Calendar, DollarSign, FolderPlus } from "lucide-react";

interface CreateProjectInput {
  title: string;
  client: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: "planned" | "active" | "completed" | "archived"; // As spec dictated
}

export default function CreateProjectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<CreateProjectInput>({
    defaultValues: { status: "planned" },
  });

  const onSubmitForm = (data: CreateProjectInput) => {
    console.log("Project ingestion payload validated:", data);
    // Trigger your TanStack Query API post mutation hook here [cite: 85]
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white border border-zinc-200 shadow-xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-zinc-900">
              Initialize Project Node{" "}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="p-6 overflow-y-auto space-y-4 bg-zinc-50/40"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                Project Title{" "}
              </label>
              <input
                type="text"
                {...register("title", { required: true })}
                placeholder="Core Ledger App"
                className="w-full px-3 py-1.5 text-sm rounded border border-zinc-200 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                Client Identifier{" "}
              </label>
              <input
                type="text"
                {...register("client", { required: true })}
                placeholder="DataPollex Ltd"
                className="w-full px-3 py-1.5 text-sm rounded border border-zinc-200 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
              Scope Description{" "}
            </label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Detail deployment infrastructure constraints..."
              className="w-full px-3 py-1.5 text-sm rounded border border-zinc-200 bg-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                Start Date{" "}
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full px-3 py-1.5 text-sm rounded border border-zinc-200 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                End Target Date{" "}
              </label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full px-3 py-1.5 text-sm rounded border border-zinc-200 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                Financial Budget Allocation{" "}
              </label>
              <input
                type="number"
                {...register("budget")}
                placeholder="45000"
                className="w-full px-3 py-1.5 text-sm rounded border border-zinc-200 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                System Status{" "}
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-1.5 text-sm rounded border border-zinc-200 bg-white cursor-pointer"
              >
                <option value="planned">Planned </option>
                <option value="active">Active </option>
                <option value="completed">Completed </option>
                <option value="archived">Archived </option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2 bg-white -mx-6 -mb-6 p-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold border border-zinc-200 rounded text-zinc-600 hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Provision Project Context
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
