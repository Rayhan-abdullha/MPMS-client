"use client";

import TaskDetailsModal from "./TaskDetailsModal";
import CreateTaskModal from "./CreateTaskModal";
import BoardColumn from "./BoardColumn";
import BoardHeader from "./BorderHeader";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { Task as BoardTask } from "../board.types";
import {
  Task,
  TaskStatus,
  useBoard,
  type Task as BoardBoardTask,
} from "../hooks/useBoard";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Loader2 } from "lucide-react";

const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "REVIEW", title: "Review Required" },
  { id: "DONE", title: "Done / Dispatched" },
];

export default function SprintKanbanEngineView() {
  // -----------------------------
  // FETCH TASKS

  const params = useParams();
  const activeSprintId = params?.slag?.[0] ?? "";

  const userRole = "MANAGER"; // Read from context authentication session slice in production

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTaskNode, setSelectedTaskNode] = useState<Task | null>(null);

  const { useGetTaskBySprintId, useUpdateTaskStatus } = useBoard();
  const { data: tasks = [], isLoading } = useGetTaskBySprintId(activeSprintId);
  const { mutate: updateStatus } = useUpdateTaskStatus(activeSprintId);
  console.log(tasks);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    updateStatus({
      taskId: draggableId,
      status: destination.droppableId as TaskStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-zinc-400 gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
        <span className="text-xs font-bold tracking-wider uppercase">
          Loading Kanban Lifecycle Data...
        </span>
      </div>
    );
  }

  // Refetch data state binding resolution context if modal holds open focus
  const inspectedLiveTaskNode =
    tasks.find((t) => t.id === selectedTaskNode?.id) || selectedTaskNode;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 antialiased">
      <BoardHeader
        userRole={userRole}
        onAddTask={() => setIsCreateOpen(true)}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const currentLaneTasks = tasks.filter((t) => {
              return t.status === col.id;
            });
            return (
              <BoardColumn
                key={col.id}
                column={col}
                tasks={currentLaneTasks}
                sprintId={activeSprintId}
                onAddTask={() => setIsCreateOpen(true)}
                onViewDetails={(task) => setSelectedTaskNode(task)}
              />
            );
          })}
        </div>
      </DragDropContext>

      {/* Creation apparatus layer portal */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Deep element inspection drawer apparatus */}
      {selectedTaskNode && (
        <TaskDetailsModal
          task={inspectedLiveTaskNode!}
          sprintId={activeSprintId}
          isOpen={!!selectedTaskNode}
          onClose={() => setSelectedTaskNode(null)}
        />
      )}
    </div>
  );
}
