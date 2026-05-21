"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { KanbanData, TaskPriority } from "../board.types";
import {
  MoreHorizontal,
  Plus,
  MessageSquare,
  Paperclip,
  User,
  ShieldAlert,
  Layers,
} from "lucide-react";
import { clsx } from "clsx";

// Import your newly structured custom modals
import CreateSprintModal, {
  SprintFormData,
} from "@/features/board/components/CreateSprintModal";
import CreateTaskModal, {
  TaskFormData,
} from "@/features/board/components/CreateTaskModal";

// Production mockup seeds representing active sprint ledger tasks
const initialKanbanState: KanbanData = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Architect Ledger Verification Pipeline",
      description:
        "Design strict double-entry cryptographic validation checkpoints for clearing nodes.",
      priority: "CRITICAL",
      assignee: { name: "Rayhan" },
      sprintId: "sprint-1",
    },
    "task-2": {
      id: "task-2",
      title: "Optimize Cache TTL for Cart Rules",
      description:
        "Configure eviction strategies inside distributed Redis clusters to protect memory pools.",
      priority: "HIGH",
      assignee: { name: "Asif" },
      sprintId: "sprint-1",
    },
    "task-3": {
      id: "task-3",
      title: "Refactor Asynchronous cascading dropdown arrays",
      description:
        "Optimize recursive payloads for structural regional geo-data ingestion scripts.",
      priority: "LOW",
      assignee: { name: "Rayhan" },
      sprintId: "sprint-1",
    },
    "task-4": {
      id: "task-4",
      title: "Implement JWT Token Rotation Hooks",
      description:
        "Integrate refresh lifecycle interception states using absolute browser context paths.",
      priority: "MEDIUM",
      assignee: { name: "Nisha" },
      sprintId: "sprint-1",
    },
  },
  columns: {
    "col-backlog": {
      id: "col-backlog",
      title: "Sprint Backlog",
      taskIds: ["task-3"],
    },
    "col-progress": {
      id: "col-progress",
      title: "In Progress",
      taskIds: ["task-1", "task-4"],
    },
    "col-review": {
      id: "col-review",
      title: "Code Review",
      taskIds: ["task-2"],
    },
    "col-done": { id: "col-done", title: "Done / Verified", taskIds: [] },
  },
  columnOrder: ["col-backlog", "col-progress", "col-review", "col-done"],
};

export default function KanbanBoard() {
  const [boardData, setBoardData] = useState<KanbanData>(initialKanbanState);

  // Modal Trigger States
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Guard and UI Error Interception Alerts
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"ADMIN" | "MANAGER" | "MEMBER">(
    "MEMBER",
  );

  // Extract authentication parameters locally to coordinate role visibilities
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("mpms_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.role) setUserRole(parsed.role.toUpperCase());
      }
    } catch (e) {
      console.warn("Session context extraction fault:", e);
    }
  }, []);

  const isManagementTier = userRole === "ADMIN" || userRole === "MANAGER";

  const getPriorityStyles = (priority: TaskPriority) => {
    const schemas = {
      CRITICAL: "bg-red-50 text-red-700 border-red-100",
      HIGH: "bg-amber-50 text-amber-700 border-amber-100",
      MEDIUM: "bg-indigo-50 text-indigo-700 border-indigo-100",
      LOW: "bg-zinc-100 text-zinc-600 border-zinc-200",
    };
    return schemas[priority] || schemas.LOW;
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // ❗ Assignment Rule Verification Check:
    // "If the status is Review required, the manager must approve to move to Done."
    if (
      source.droppableId === "col-review" &&
      destination.droppableId === "col-done"
    ) {
      if (!isManagementTier) {
        setAlertMessage(
          "Access Restricted: Only an ADMIN or MANAGER can sign off and dispatch reviews to 'Done'.",
        );
        // Dismiss the validation alert automatically after a short timeout window
        setTimeout(() => setAlertMessage(null), 5000);
        return; // Terminate state mutation to snap the card safely back to Code Review
      }
    }

    const startColumn = boardData.columns[source.droppableId];
    const finishColumn = boardData.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setBoardData({
        ...boardData,
        columns: { ...boardData.columns, [newColumn.id]: newColumn },
      });
      return;
    }

    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartColumn = { ...startColumn, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = { ...finishColumn, taskIds: finishTaskIds };

    setBoardData({
      ...boardData,
      columns: {
        ...boardData.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    });
  };

  // Process newly provisioned sprint records locally
  const handleSprintSubmit = async (data: SprintFormData) => {
    console.log("Sprint Form Submission Ingestion Matrix:", data);
    // Real pipeline target: await api.post('/sprints', data)
  };

  // Append a structural task entry safely across state matrix layers
  const handleTaskSubmit = async (data: any) => {
    const uniqueTaskId = `task-${Date.now()}`;

    const spawnedTask = {
      id: uniqueTaskId,
      title: data.title,
      description: data.description,
      priority: data.priority as TaskPriority,
      assignee: { name: data.assignees[0] || "Unassigned Node" },
      sprintId: "sprint-1",
    };

    setBoardData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [uniqueTaskId]: spawnedTask,
      },
      columns: {
        ...prev.columns,
        "col-backlog": {
          ...prev.columns["col-backlog"],
          taskIds: [...prev.columns["col-backlog"].taskIds, uniqueTaskId],
        },
      },
    }));
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Dynamic Authorization Error Alert Banner */}
      {alertMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-xs font-semibold">{alertMessage}</p>
        </div>
      )}

      {/* Sprint Metadata Filtering Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Sprint Kanban Engine
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Active Scope:{" "}
            <span className="font-semibold text-zinc-800">
              Sprint Lifecycle Alpha 04 ({userRole} Control Panel)
            </span>
          </p>
        </div>

        {/* Action Triggers with Conditional Layout Rendering */}
        <div className="flex items-center gap-2">
          {isManagementTier && (
            <button
              onClick={() => setIsSprintModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-bold rounded-lg transition-colors cursor-pointer outline-none"
            >
              <Layers className="h-3.5 w-3.5 text-zinc-400" /> New Sprint
            </button>
          )}
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer outline-none"
          >
            <Plus className="h-3.5 w-3.5" /> Add Task Card
          </button>
        </div>
      </div>

      {/* Primary Context Drop Arena Mapping Canvas */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start select-none">
          {boardData.columnOrder.map((columnId) => {
            const column = boardData.columns[columnId];
            const tasks = column.taskIds
              .map((taskId) => boardData.tasks[taskId])
              .filter(Boolean); // Resilience check preventing broken undefined mappings

            return (
              <div
                key={column.id}
                className="bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col max-h-[80vh]"
              >
                {/* Column Header Component */}
                <div className="p-4 flex items-center justify-between border-b border-zinc-200/60 bg-white/50 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                      {column.title}
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 bg-zinc-200/60 text-zinc-600 rounded-md">
                      {tasks.length}
                    </span>
                  </div>
                  <button className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                {/* Droppable Interactive Board Container */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={clsx(
                        "p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px] transition-colors duration-150 custom-scrollbar",
                        snapshot.isDraggingOver
                          ? "bg-indigo-50/40"
                          : "bg-transparent",
                      )}
                    >
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style }}
                              className={clsx(
                                "bg-white border rounded-xl p-4 transition-all group flex flex-col justify-between shadow-xs",
                                snapshot.isDragging
                                  ? "border-indigo-600 shadow-md ring-2 ring-indigo-600/10 rotate-[1deg]"
                                  : "border-zinc-200 hover:border-zinc-300 hover:shadow-xs",
                              )}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2.5">
                                  <span
                                    className={clsx(
                                      "px-2 py-0.5 text-[10px] font-bold tracking-wide border rounded-md uppercase",
                                      getPriorityStyles(task.priority),
                                    )}
                                  >
                                    {task.priority}
                                  </span>
                                  <span className="text-[11px] text-zinc-400 font-mono">
                                    #{task.id}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-zinc-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                                  {task.title}
                                </h4>
                                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
                                  {task.description}
                                </p>
                              </div>

                              {/* Card Structural Footer Metrics */}
                              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                                <div className="flex items-center gap-2.5 text-zinc-400">
                                  <div className="flex items-center gap-0.5 text-[11px]">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span>2</span>
                                  </div>
                                  <div className="flex items-center gap-0.5 text-[11px]">
                                    <Paperclip className="h-3.5 w-3.5" />
                                    <span>1</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-medium text-zinc-600">
                                    {task.assignee?.name || "Unassigned"}
                                  </span>
                                  <div className="h-6 w-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 shadow-inner">
                                    <User className="h-3 w-3" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Column Ingestion Trigger */}
                <div className="p-2 border-t border-zinc-200/50 bg-white/30 rounded-b-xl">
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-zinc-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200 transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add New Task card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* ======================================================= */}
      {/* Form Overlay Portals Mounted Safely at Page Root Block */}
      {/* ======================================================= */}

      <CreateSprintModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        onSubmit={handleSprintSubmit}
        nextSprintNumber={5}
      />

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
      />
    </div>
  );
}
