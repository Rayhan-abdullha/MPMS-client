"use client";

import { useEffect, useState, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { useBoard } from "@/features/board/hooks/useBoard";
import { clsx } from "clsx";
import {
  Clock,
  FolderKanban,
  Layers,
  Calendar,
  SlidersHorizontal,
  X,
  User,
  Loader2,
} from "lucide-react";
import { AssignedTask } from "@/features/my-task/MyTask.types";
import { MyTaskDetailsModal } from "@/features/my-task/components/MyTaskDetailsModal";

const COLUMNS = [
  { id: "TODO", title: "To Do", bgClass: "bg-zinc-50/50" },
  { id: "IN_PROGRESS", title: "In Progress", bgClass: "bg-amber-50/10" },
  { id: "REVIEW", title: "Review Required", bgClass: "bg-indigo-50/10" },
  { id: "DONE", title: "Completed", bgClass: "bg-emerald-50/10" },
];

const PRIORITY_THEME = {
  LOW: "bg-zinc-400 text-zinc-600 border-zinc-200",
  MEDIUM: "bg-amber-500 text-amber-700 border-amber-200",
  HIGH: "bg-rose-500 text-rose-700 border-rose-200",
};

export default function MyTasksWorkspace() {
  const [mounted, setMounted] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AssignedTask | null>(null);

  // Filter Dropdown UI States
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");
  const [selectedSprintId, setSelectedSprintId] = useState<string>("ALL");
  const [activeDropdown, setActiveDropdown] = useState<
    "project" | "sprint" | null
  >(null);

  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const sprintDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle outside click to shut open filter panels safely
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        activeDropdown === "project" &&
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(target)
      ) {
        setActiveDropdown(null);
      }
      if (
        activeDropdown === "sprint" &&
        sprintDropdownRef.current &&
        !sprintDropdownRef.current.contains(target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const { getAssignedTask, useUpdateTaskStatus } = useBoard();
  const { data: tasks = [], isLoading } = getAssignedTask();
  const { mutate: updateStatus } = useUpdateTaskStatus("");

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const nextStatus = destination.droppableId as AssignedTask["status"];

    updateStatus({
      taskId: draggableId,
      status: nextStatus,
    });

    if (selectedTask?.id === draggableId) {
      setSelectedTask((prev) =>
        prev ? { ...prev, status: nextStatus } : null,
      );
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  // Extract unique projects and sprints from raw developer task nodes dynamically
  const uniqueProjects = Array.from(
    new Map(
      tasks.filter((t) => t.project).map((t) => [t.project!.id, t.project!]),
    ).values(),
  );

  const uniqueSprints = Array.from(
    new Map(
      tasks.filter((t) => t.sprint).map((t) => [t.sprint!.id, t.sprint!]),
    ).values(),
  );

  // Apply operational workspace pipeline matrix filtering
  const filteredTasks = tasks.filter((task) => {
    const matchProject =
      selectedProjectId === "ALL" || task.projectId === selectedProjectId;
    const matchSprint =
      selectedSprintId === "ALL" || task.sprintId === selectedSprintId;
    return matchProject && matchSprint;
  });

  const activeProjectLabel =
    uniqueProjects.find((p) => p.id === selectedProjectId)?.title ||
    "All Projects";
  const activeSprintLabel =
    uniqueSprints.find((s) => s.id === selectedSprintId)?.title ||
    "All Sprints";
  const hasActiveFilters =
    selectedProjectId !== "ALL" || selectedSprintId !== "ALL";

  const clearFilters = () => {
    setSelectedProjectId("ALL");
    setSelectedSprintId("ALL");
    setActiveDropdown(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 antialiased selection:bg-indigo-500/10">
      {/* HEADER BAR AND FILTERS INTERACTION LAYER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            My Tasks Workspace
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Isolated developer delivery lanes mapped across active sprintholes.
          </p>
        </div>

        {/* WORKSPACE FILTERS CONTROLS MODULE */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold uppercase tracking-wider mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Scope Filters</span>
          </div>

          {/* PROJECT CONFIG SELECT DROPDOWN */}
          <div className="relative" ref={projectDropdownRef}>
            <button
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "project" ? null : "project",
                )
              }
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 bg-white border rounded-xl text-xs font-semibold text-zinc-700 hover:border-zinc-300 transition shadow-3xs cursor-pointer",
                selectedProjectId !== "ALL" &&
                  "border-indigo-200 bg-indigo-50/10 text-indigo-900",
              )}
            >
              <FolderKanban
                className={clsx(
                  "h-3.5 w-3.5 text-zinc-400",
                  selectedProjectId !== "ALL" && "text-indigo-500",
                )}
              />
              <span>{activeProjectLabel}</span>
            </button>

            {activeDropdown === "project" && (
              <div className="absolute right-0 md:left-0 mt-1 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl p-1 z-40 animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  onClick={() => {
                    setSelectedProjectId("ALL");
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  All Active Projects
                </button>
                {uniqueProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setActiveDropdown(null);
                    }}
                    className={clsx(
                      "w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors truncate block",
                      selectedProjectId === p.id &&
                        "bg-zinc-50 text-indigo-600 font-bold",
                    )}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SPRINT CONFIG SELECT DROPDOWN */}
          <div className="relative" ref={sprintDropdownRef}>
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === "sprint" ? null : "sprint")
              }
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 bg-white border rounded-xl text-xs font-semibold text-zinc-700 hover:border-zinc-300 transition shadow-3xs cursor-pointer",
                selectedSprintId !== "ALL" &&
                  "border-indigo-200 bg-indigo-50/10 text-indigo-900",
              )}
            >
              <Layers
                className={clsx(
                  "h-3.5 w-3.5 text-zinc-400",
                  selectedSprintId !== "ALL" && "text-indigo-500",
                )}
              />
              <span>{activeSprintLabel}</span>
            </button>

            {activeDropdown === "sprint" && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl p-1 z-40 animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  onClick={() => {
                    setSelectedSprintId("ALL");
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  All Iteration Sprints
                </button>
                {uniqueSprints.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSprintId(s.id);
                      setActiveDropdown(null);
                    }}
                    className={clsx(
                      "w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors truncate block",
                      selectedSprintId === s.id &&
                        "bg-zinc-50 text-indigo-600 font-bold",
                    )}
                  >
                    {s.title} {s.sprintNumber && `(#${s.sprintNumber})`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RESET DISPATCH ACTUATOR */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 bg-zinc-100 rounded-xl hover:bg-zinc-200/70 transition cursor-pointer"
            >
              <X className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* DRAG AND DROP COLUMN RENDERING GRAPH */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter(
              (t) => t.status === col.id,
            );

            return (
              <div
                key={col.id}
                className={clsx(
                  "border border-zinc-200/80 rounded-2xl flex flex-col max-h-[75vh] bg-zinc-50/40 shadow-xs",
                  col.bgClass,
                )}
              >
                {/* COLUMN TOP LINE */}
                <div className="p-4 flex items-center justify-between bg-white rounded-t-2xl border-b border-zinc-200/60">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-zinc-800 tracking-tight">
                      {col.title}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-zinc-100 text-zinc-500 border border-zinc-200/60 rounded">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* DROP CONTAINER GRID */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={clsx(
                        "p-3 flex-1 space-y-3 overflow-y-auto min-h-[350px] transition-colors custom-scrollbar",
                        snapshot.isDraggingOver && "bg-indigo-50/20",
                      )}
                    >
                      {columnTasks.map((task: AssignedTask, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              onClick={() => setSelectedTask(task)}
                              className={clsx(
                                "p-3.5 rounded-xl border bg-white border-zinc-200 shadow-3xs hover:border-zinc-300 transition-all select-none flex flex-col gap-2.5 group cursor-pointer",
                                dragSnapshot.isDragging &&
                                  "shadow-xl ring-4 ring-indigo-600/5 border-indigo-500 scale-[1.02]",
                              )}
                            >
                              {/* METADATA TOP BADGE ROW */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded border border-zinc-200/30">
                                  {task.id.substring(0, 6).toUpperCase()}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  {/* PRIORITY ELEMENT DOT REVEAL */}
                                  <span
                                    className={clsx(
                                      "h-1.5 w-1.5 rounded-full shrink-0",
                                      PRIORITY_THEME[task.priority]?.split(
                                        " ",
                                      )[0],
                                    )}
                                  />
                                  <span
                                    className={clsx(
                                      "text-[9px] font-bold uppercase tracking-wider",
                                      PRIORITY_THEME[task.priority]?.split(
                                        " ",
                                      )[1],
                                    )}
                                  >
                                    {task.priority}
                                  </span>
                                </div>
                              </div>

                              {/* COMPREHENSIVE TEXT ASSETS */}
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-zinc-800 group-hover:text-zinc-900 leading-snug tracking-tight transition-colors">
                                  {task.title}
                                </h4>
                                {task.description && (
                                  <p className="text-[11px] text-zinc-400 font-medium line-clamp-2 leading-relaxed">
                                    {task.description}
                                  </p>
                                )}
                              </div>

                              {/* RECONFIGURED BOTTOM SUB-ASSET DETAILS ELEMENT MATRIX */}
                              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-zinc-100">
                                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-zinc-400">
                                  {task.estimateHours && (
                                    <span className="flex items-center gap-0.5 font-mono font-semibold bg-zinc-50 px-1 py-0.5 rounded border border-zinc-200/40">
                                      <Clock className="h-2.5 w-2.5 text-zinc-400" />
                                      {task.estimateHours}h
                                    </span>
                                  )}

                                  {task.dueDate && (
                                    <span className="flex items-center gap-0.5 font-mono text-zinc-500">
                                      <Calendar className="h-2.5 w-2.5 text-zinc-400" />
                                      {new Date(
                                        task.dueDate,
                                      ).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  )}

                                  {task.project && !selectedProjectId && (
                                    <span className="flex items-center gap-0.5 max-w-[80px] truncate">
                                      <FolderKanban className="h-2.5 w-2.5 text-zinc-300" />
                                      {task.project.title}
                                    </span>
                                  )}
                                </div>

                                {/* AVATAR MATRIX ALLOCATED TEAM STACK */}
                                <div className="flex items-center -space-x-1.5 overflow-hidden">
                                  {task.assignees &&
                                  task.assignees.length > 0 ? (
                                    task.assignees
                                      .slice(0, 3)
                                      .map((assignee: any) => (
                                        <div
                                          key={assignee.id}
                                          title={assignee.user.name}
                                          className="h-4 w-4 rounded-full bg-zinc-100 border border-white text-zinc-600 flex items-center justify-center font-bold text-[8px] uppercase font-mono ring-1 ring-zinc-200/50"
                                        >
                                          {assignee.user.name.substring(0, 2)}
                                        </div>
                                      ))
                                  ) : (
                                    <User className="h-4 w-4 text-zinc-300" />
                                  )}
                                  {task.assignees &&
                                    task.assignees.length > 3 && (
                                      <span className="text-[8px] font-bold text-zinc-400 pl-1">
                                        +{task.assignees.length - 3}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}

                      {columnTasks.length === 0 && (
                        <p className="text-center text-[10px] text-zinc-400 font-medium py-12 italic select-none">
                          No tasks active
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* DETAILED MODAL ASSIGNED MOUNT PORTAL */}
      {selectedTask && (
        <MyTaskDetailsModal
          task={tasks.find((t) => t.id === selectedTask.id) || selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
