"use client";

import { Clock, Layers } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProject } from "../hooks/useProject";

const SprintBoard = () => {
  const params = useParams();
  const projectId = params?.id as string;
  const [activeSprint, setActiveSprint] = useState<string>("");
  const [loggedHours, setLoggedHours] = useState<number>(14);
  const [hoursInput, setHoursInput] = useState<string>("");

  const { useGetSprintsByProject, useCreateSprintByProject } = useProject();

  const { data, isLoading } = useGetSprintsByProject(projectId);

  const sprints =
    data?.sprints?.map((sprint: any) => ({
      id: sprint.id,
      num: sprint.order ?? 1,
      title: sprint.title,
      count: sprint._count?.tasks ?? 0,
    })) || [];

  const handleLogTime = (e: React.FormEvent) => {
    e.preventDefault();

    const uniqueHours = parseFloat(hoursInput);

    if (!isNaN(uniqueHours) && uniqueHours > 0) {
      setLoggedHours((prev) => prev + uniqueHours);
      setHoursInput("");
    }
  };

  return (
    <div className="lg:col-span-5 space-y-4">
      {/* Sprint List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-zinc-400" /> Allocated Project
          Milestones
        </h3>

        {isLoading ? (
          <div className="text-xs text-zinc-500 p-3">Loading sprints...</div>
        ) : sprints.length === 0 ? (
          <div className="text-xs text-zinc-500 p-3">No sprints found</div>
        ) : (
          sprints.map((sprint) => (
            <div
              key={sprint.id}
              onClick={() => setActiveSprint(sprint.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                activeSprint === sprint.id
                  ? "border-indigo-600 bg-indigo-50/40 shadow-xs"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">
                    Sprint {sprint.num}: {sprint.title}
                  </h4>

                  <p className="text-xs text-zinc-400 mt-0.5">
                    {sprint.count} structural card blocks active
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Effort Tracking */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-zinc-400" /> Effort Accountability
            Track
          </h4>

          <span className="text-xs font-mono font-bold bg-zinc-100 text-zinc-700 border border-zinc-200 px-2 py-0.5 rounded">
            Total: {loggedHours} hrs
          </span>
        </div>

        <form onSubmit={handleLogTime} className="flex gap-2">
          <input
            type="number"
            step="0.5"
            min="0.5"
            placeholder="Log spent hours (e.g., 3.5)"
            value={hoursInput}
            onChange={(e) => setHoursInput(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600"
          />

          <button
            type="submit"
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Log Hours
          </button>
        </form>
      </div>
    </div>
  );
};

export default SprintBoard;
