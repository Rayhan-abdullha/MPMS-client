"use client";

import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { KanbanData, TaskPriority } from "../board.types";
import { useParams } from "next/navigation";

import CreateTaskModal from "@/features/board/components/CreateTaskModal";
import AlertBanner from "./AlertBanner";
import BoardHeader from "./BorderHeader";
import BoardColumn from "./BoardColumn";

import { useProject } from "@/features/projects/hooks/useProject";
import { useBoard } from "../hooks/useBoard";

// -----------------------------
// API HOOK (FIXED)
// -----------------------------

// -----------------------------
// KANBAN BOARD
// -----------------------------
export default function KanbanBoard() {
  const params = useParams();
  const sprintId = params?.slag?.[0] ?? "";

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const [userRole, setUserRole] = useState<"ADMIN" | "MANAGER" | "MEMBER">(
    "MEMBER",
  );

  const [boardData, setBoardData] = useState<KanbanData>({
    tasks: {},
    columns: {
      "col-backlog": {
        id: "col-backlog",
        title: "Backlog",
        taskIds: [],
      },
      "col-progress": {
        id: "col-progress",
        title: "In Progress",
        taskIds: [],
      },
      "col-review": {
        id: "col-review",
        title: "Review",
        taskIds: [],
      },
      "col-done": {
        id: "col-done",
        title: "Done",
        taskIds: [],
      },
    },
    columnOrder: ["col-backlog", "col-progress", "col-review", "col-done"],
  });

  const { useGetTaskBySprintId } = useBoard();

  // -----------------------------
  // FETCH TASKS
  // -----------------------------
  const { data: tasks = [] } = useGetTaskBySprintId(sprintId);
  console.log(tasks);

  // -----------------------------
  // SESSION ROLE
  // -----------------------------
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mpms_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserRole(parsed.role?.toUpperCase() || "MEMBER");
      }
    } catch {}
  }, []);

  const isManagement = userRole === "ADMIN" || userRole === "MANAGER";

  // -----------------------------
  // MAP API → KANBAN
  // -----------------------------
  useEffect(() => {
    if (!tasks.length) return;

    const taskMap: any = {};
    const columns = {
      "col-backlog": [] as string[],
      "col-progress": [] as string[],
      "col-review": [] as string[],
      "col-done": [] as string[],
    };

    tasks.forEach((task: any) => {
      taskMap[task.id] = {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignee: task.assignees?.[0]?.user || {
          name: "Unassigned",
        },
        sprintId: task.sprintId,
        status: task.status,
      };

      if (task.status === "TODO") {
        columns["col-backlog"].push(task.id);
      } else if (task.status === "IN_PROGRESS") {
        columns["col-progress"].push(task.id);
      } else if (task.status === "REVIEW") {
        columns["col-review"].push(task.id);
      } else if (task.status === "DONE") {
        columns["col-done"].push(task.id);
      }
    });

    setBoardData((prev) => ({
      ...prev,
      tasks: taskMap,
      columns: {
        ...prev.columns,
        "col-backlog": {
          ...prev.columns["col-backlog"],
          taskIds: columns["col-backlog"],
        },
        "col-progress": {
          ...prev.columns["col-progress"],
          taskIds: columns["col-progress"],
        },
        "col-review": {
          ...prev.columns["col-review"],
          taskIds: columns["col-review"],
        },
        "col-done": {
          ...prev.columns["col-done"],
          taskIds: columns["col-done"],
        },
      },
    }));
  }, [tasks]);

  // -----------------------------
  // DRAG HANDLER
  // -----------------------------
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (
      source.droppableId === "col-review" &&
      destination.droppableId === "col-done" &&
      !isManagement
    ) {
      setAlertMessage("Only ADMIN/MANAGER can approve review → done");

      setTimeout(() => setAlertMessage(null), 4000);
      return;
    }

    const start = boardData.columns[source.droppableId];
    const finish = boardData.columns[destination.droppableId];

    if (start === finish) {
      const newIds = Array.from(start.taskIds);
      newIds.splice(source.index, 1);
      newIds.splice(destination.index, 0, draggableId);

      setBoardData((prev) => ({
        ...prev,
        columns: {
          ...prev.columns,
          [start.id]: {
            ...start,
            taskIds: newIds,
          },
        },
      }));

      return;
    }

    const startIds = Array.from(start.taskIds);
    startIds.splice(source.index, 1);

    const finishIds = Array.from(finish.taskIds);
    finishIds.splice(destination.index, 0, draggableId);

    setBoardData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [start.id]: { ...start, taskIds: startIds },
        [finish.id]: { ...finish, taskIds: finishIds },
      },
    }));
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="h-full flex flex-col space-y-6">
      {alertMessage && <AlertBanner message={alertMessage} />}

      <BoardHeader
        userRole={userRole}
        onAddTask={() => setIsTaskModalOpen(true)}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {boardData.columnOrder.map((colId) => {
            const column = boardData.columns[colId];

            const tasks = column.taskIds
              .map((id) => boardData.tasks[id])
              .filter(Boolean);

            return (
              <BoardColumn
                key={column.id}
                column={column}
                tasks={tasks}
                onAddTask={() => setIsTaskModalOpen(true)}
              />
            );
          })}
        </div>
      </DragDropContext>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
}
