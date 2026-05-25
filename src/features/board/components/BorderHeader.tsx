"use client";

import { useProject } from "@/features/projects/hooks/useProject";
import { Plus, FolderKanban, Calendar, User, Layers } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

interface Props {
  userRole: string;
  onAddTask: () => void;
}

export default function BoardHeader({ userRole, onAddTask }: Props) {
  const params = useParams();

  // Extracting route parameter (handling string or string arrays safely)
  const activeSprintId = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug || params?.slag?.[0] || "";

  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { useGetSingleProject } = useProject();

  // Fetch complete project schema mapping
  const { data: projectData = {} as any } = useGetSingleProject(
    projectId as string,
  );
  const project = projectData.project || {};

  // Resolve active iteration step dynamically from embedded sprint records array
  const currentSprint = project?.sprints?.find(
    (sprint: any) => sprint.id === activeSprintId,
  );

  // Date formatting options helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const isAuthorizedToEdit = userRole === "ADMIN" || userRole === "MANAGER";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 pb-5 border-b border-zinc-200/80 antialiased">
      {/* LEFT CONTENT AREA: PROJECT META LABELS */}
      <div className="space-y-2.5 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* PROJECT HUB MAIN BADGE TITLE */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 text-white rounded-lg text-xs font-bold tracking-tight shadow-3xs">
            <FolderKanban className="h-3.5 w-3.5 text-zinc-300" />
            <span>{project?.title || "Workspace Engine"}</span>
          </div>

          {/* DYNAMIC SPRINT META PILL INDICATOR */}
          {currentSprint && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-bold tracking-tight">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>{currentSprint.title}</span>
              <span className="font-mono bg-indigo-600 text-white text-[10px] px-1 py-0.2 rounded font-black">
                #{currentSprint.sprintNumber}
              </span>
            </div>
          )}
        </div>

        {/* WORKSPACE DESCRIPTION DEFINITIONS */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight leading-none">
            Sprint Kanban Engine
          </h1>
          {project?.description && (
            <p className="text-xs text-zinc-500 mt-1.5 font-medium leading-relaxed max-w-2xl line-clamp-1 hover:line-clamp-none transition-all duration-200 cursor-default">
              {project.description}
            </p>
          )}
        </div>

        {/* GRANULAR COMPONENT TRACKING CRITERIA */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-0.5 text-[11px] font-semibold text-zinc-400">
          {project?.client && (
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-zinc-300" />
              <span>Client Owner:</span>
              <span className="text-zinc-700 font-bold">{project.client}</span>
            </div>
          )}

          {currentSprint?.startDate && currentSprint?.endDate ? (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-zinc-300" />
              <span>Sprint Window:</span>
              <span className="text-zinc-700 font-bold font-mono">
                {formatDate(currentSprint.startDate)} –{" "}
                {formatDate(currentSprint.endDate)}
              </span>
            </div>
          ) : project?.startDate && project?.endDate ? (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-zinc-300" />
              <span>Global Timeline:</span>
              <span className="text-zinc-700 font-bold font-mono">
                {formatDate(project.startDate)} – {formatDate(project.endDate)}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* RIGHT CONTENT AREA: SYSTEM PANEL CONTROLS ACTION */}
      {isAuthorizedToEdit && (
        <div className="shrink-0 flex items-center md:justify-end">
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-50 border border-zinc-200/90 hover:border-zinc-300 text-zinc-800 text-xs font-bold rounded-xl shadow-3xs hover:shadow-2xs active:scale-[0.98] transition-all cursor-pointer group focus:outline-none focus:ring-4 focus:ring-zinc-600/5"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
            <span>Append New Task</span>
          </button>
        </div>
      )}
    </div>
  );
}
