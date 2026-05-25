"use client";

import { Layers, CalendarDays, CheckCircle2, FolderKanban } from "lucide-react";
import { useState } from "react";
import { useBoard, Sprint } from "../hooks/useBoard";
import Link from "next/link";

const AllProjectSprints = () => {
  const [activeSprint, setActiveSprint] = useState<string>("");

  const { useGetAllSprints } = useBoard();
  const { data: sprints = [], isLoading } = useGetAllSprints();

  return (
    <div className="lg:col-span-5 space-y-4">
      <div className="space-y-3">
        {/* Section Header */}
        <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-zinc-400" />
          Allocated Project Milestones
        </h3>

        {isLoading ? (
          <div className="text-xs text-zinc-500 p-3">Loading sprints...</div>
        ) : sprints.length === 0 ? (
          <div className="text-xs text-zinc-500 p-3">No sprints found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sprints.map((sprint: Sprint) => {
              const isActive = activeSprint === sprint.id;
              const status = sprint.status;

              return (
                <Link
                  href={`/dashboard/board/${sprint.id}?projectId=${encodeURIComponent(sprint.project.id)}`}
                  key={sprint.id}
                  onClick={() => setActiveSprint(sprint.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none h-full ${
                    isActive
                      ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      {/* 1. Main Title: Changed to display Project Title */}
                      <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">
                        {sprint.project.title}
                      </h4>

                      {/* 2. Subtitle: Changed to display the sprint identity explicitly */}
                      <p className="text-xs text-zinc-500 font-medium">
                        Sprint #{sprint.sprintNumber} — {sprint.title}
                      </p>
                    </div>

                    {/* Status */}
                    <div
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-wide ${
                        status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : status === "COMPLETED"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {status}
                    </div>
                  </div>

                  {/* Project Meta Info */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                    <FolderKanban className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="font-medium text-zinc-700">
                      Infrastructure Core
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span>{sprint.project.status}</span>
                  </div>

                  {/* Footer Context Info */}
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100/80 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{sprint.taskCount} Tasks</span>
                    </div>

                    {/* 3. Explicit Time window presentation layout block */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="font-medium text-zinc-600">
                        {new Date(sprint.startDate).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                        {" - "}
                        {new Date(sprint.endDate).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjectSprints;
