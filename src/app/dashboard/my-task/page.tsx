"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { useBoard } from "@/features/board/hooks/useBoard";
import { clsx } from "clsx";
import { Clock, FolderKanban } from "lucide-react";
import { AssignedTask } from "@/features/my-task/MyTask.types";
import { MyTaskDetailsModal } from "@/features/my-task/components/MyTaskDetailsModal";

const COLUMNS = [
  { id: "TODO", title: "To Do", bgClass: "bg-zinc-50/50" },
  { id: "IN_PROGRESS", title: "In Progress", bgClass: "bg-amber-50/10" },
  { id: "REVIEW", title: "Review Required", bgClass: "bg-indigo-50/10" },
  { id: "DONE", title: "Completed", bgClass: "bg-emerald-50/10" },
];

export default function MyTasksWorkspace() {
  const [mounted, setMounted] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AssignedTask | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { getAssignedTask, useUpdateTaskStatus } = useBoard();
  const { data: tasks = [], isLoading } = getAssignedTask();
  const { mutate: updateStatus } = useUpdateTaskStatus("");

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

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

  // Prevent SSR hydration mismatch
  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-8 text-xs font-mono font-bold text-zinc-400 tracking-widest uppercase animate-pulse">
        Loading pipeline task graph...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 antialiased selection:bg-indigo-500/10">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          My Tasks Workspace
        </h1>

        <p className="text-xs text-zinc-500 mt-0.5">
          Isolated developer delivery lanes mapped across distinct active
          sprintholes.
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className={clsx(
                  "border border-zinc-200/80 rounded-2xl flex flex-col max-h-[75vh] bg-zinc-50/40 shadow-xs",
                  col.bgClass,
                )}
              >
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

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={clsx(
                        "p-3 flex-1 space-y-3 overflow-y-auto min-h-[300px] transition-colors custom-scrollbar",
                        snapshot.isDraggingOver && "bg-indigo-50/20",
                      )}
                    >
                      {columnTasks.map((task, index) => (
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
                                "p-3.5 rounded-xl border bg-white border-zinc-200 shadow-xs hover:border-zinc-300 transition-all select-none flex flex-col gap-2",
                                dragSnapshot.isDragging &&
                                  "shadow-xl ring-4 ring-indigo-600/5 border-indigo-500 scale-[1.02]",
                              )}
                            >
                              <h4 className="text-xs font-bold text-zinc-800 leading-snug tracking-tight">
                                {task.title}
                              </h4>

                              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-100">
                                {task.estimateHours && (
                                  <span className="flex items-center gap-0.5 font-mono">
                                    <Clock className="h-3 w-3" />
                                    {task.estimateHours}h
                                  </span>
                                )}

                                {task.project && (
                                  <span className="flex items-center gap-0.5 max-w-[100px] truncate">
                                    <FolderKanban className="h-3 w-3" />
                                    {task.project.title}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}

                      {columnTasks.length === 0 && (
                        <p className="text-center text-[10px] text-zinc-400 font-medium py-12 italic">
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
