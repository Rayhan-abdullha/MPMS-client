"use client";

import { useState, useEffect, useRef } from "react";
import { useBoard } from "@/features/board/hooks/useBoard";
import { AssignedTask } from "../MyTask.types";
import {
  Clock,
  Calendar,
  FolderKanban,
  User,
  X,
  Activity,
  FileText,
  AlertCircle,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  Check,
} from "lucide-react";
import { clsx } from "clsx";

interface ModalProps {
  task: AssignedTask;
  isOpen: boolean;
  onClose: () => void;
}

/* -------------------------------- METADATA MAPS ------------------------------- */

const STATUS_CONFIG = {
  TODO: {
    label: "To Do",
    bg: "bg-zinc-100",
    text: "text-zinc-700",
    dot: "bg-zinc-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-amber-50 text-amber-700",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  REVIEW: {
    label: "Review",
    bg: "bg-indigo-50 text-indigo-700",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  DONE: {
    label: "Completed",
    bg: "bg-emerald-50 text-emerald-700",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
};

const PRIORITY_CONFIG = {
  LOW: {
    label: "Low Priority",
    text: "text-zinc-500",
    ring: "border-zinc-200",
  },
  MEDIUM: { label: "Medium", text: "text-amber-600", ring: "border-amber-200" },
  HIGH: {
    label: "High Criticality",
    text: "text-rose-600",
    ring: "border-rose-200",
  },
};

export function MyTaskDetailsModal({ task, isOpen, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Core local states
  const [localTitle, setLocalTitle] = useState(task.title);
  const [localDesc, setLocalDesc] = useState(task.description || "");
  const [localEstimate, setLocalEstimate] = useState(task.estimateHours || "");
  const [localDueDate, setLocalDueDate] = useState(
    task.dueDate ? task.dueDate.split("T")[0] : "",
  );

  // Custom UI menu toggles
  const [activeMenu, setActiveMenu] = useState<"status" | "priority" | null>(
    null,
  );
  const [showAllLogs, setShowAllLogs] = useState(false);

  const { useUpdateTaskDetails } = useBoard();
  const { mutate: updateTask } = useUpdateTaskDetails(task.sprintId);

  // Sync state values when another element mounts or mutates data elements asynchronously
  useEffect(() => {
    if (task) {
      setLocalTitle(task.title);
      setLocalDesc(task.description || "");
      setLocalEstimate(task.estimateHours || "");
      setLocalDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    }
  }, [task]);

  // ---------------------------------------------------------------------------
  // INTERCEPT CLICK OUTSIDE WINDOW EVENT LOGIC
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        // Trigger manual string inputs blur-checks before safe context close paths
        handleBlurField("title", localTitle);
        handleBlurField("description", localDesc);
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, localTitle, localDesc]);

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // CENTRALIZED ATOMIC UPDATE DISPATCHER
  // ---------------------------------------------------------------------------
  const handleUpdateField = (payload: any) => {
    updateTask({
      taskId: task.id,
      payload,
    });
  };

  const handleBlurField = (
    fieldName: "title" | "description",
    value: string,
  ) => {
    if (value === (task as any)[fieldName]) return;
    handleUpdateField({ [fieldName]: value });
  };

  const handleSelectField = (
    fieldName: "status" | "priority",
    value: string,
  ) => {
    handleUpdateField({ [fieldName]: value });
  };

  const handleEstimateChange = (value: string) => {
    setLocalEstimate(value);
    handleUpdateField({ estimateHours: value === "" ? null : Number(value) });
  };

  const handleDueDateChange = (value: string) => {
    setLocalDueDate(value);
    handleUpdateField({ dueDate: value || null });
  };

  const logs = [...(task.activityLogs || [])].reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col md:flex-row max-h-[85vh] animate-in zoom-in-95 duration-200"
      >
        {/* MAIN PANEL CONTENT SPACE */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* NAVIGATION PROJECT PATH BREADCRUMB */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <FolderKanban className="h-3.5 w-3.5 text-zinc-300" />
            <span className="hover:text-zinc-600 transition-colors cursor-default">
              {task.project?.title || "Project Context"}
            </span>
            <span className="text-zinc-300">/</span>
            <span className="hover:text-zinc-600 transition-colors cursor-default">
              {task.sprint?.title || "Sprint Line"}
            </span>
            <span className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-500 font-bold border border-zinc-200/40">
              #{task.sprint?.sprintNumber || 1}
            </span>
          </div>

          {/* EDITABLE COMPONENT TASK TITLE */}
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={() => handleBlurField("title", localTitle)}
            className="w-full text-base sm:text-lg font-bold text-zinc-900 border-0 p-0 focus:ring-0 focus:bg-zinc-50/50 rounded-lg tracking-tight transition-colors placeholder-zinc-300"
            placeholder="Specify task headline..."
          />

          {/* TASK DESCRIPTION SUB-SECTION */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 cursor-default select-none">
              <FileText className="h-3 w-3" /> Scope Details Description
            </label>
            <textarea
              value={localDesc}
              onChange={(e) => setLocalDesc(e.target.value)}
              onBlur={() => handleBlurField("description", localDesc)}
              className="w-full text-xs text-zinc-600 bg-zinc-50/40 border border-zinc-200/80 rounded-xl p-3 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 min-h-[120px] resize-none leading-relaxed transition-all outline-none"
              placeholder="Inject actionable implementation definitions or functional requirements..."
            />
          </div>

          {/* HISTORICAL TIMELINE SYSTEM AUDITS */}
          <div className="space-y-3 pt-2">
            <div
              onClick={() => setShowAllLogs(!showAllLogs)}
              className="group flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider select-none cursor-pointer"
            >
              <span className="flex items-center gap-1 group-hover:text-zinc-600 transition-colors">
                <Activity className="h-3 w-3" /> Audit Evolution Trail (
                {logs.length})
              </span>
              <span className="text-indigo-600 hover:text-indigo-700 text-[11px] font-bold tracking-tight normal-case transition-colors">
                {showAllLogs ? "Collapse records" : "View complete log history"}
              </span>
            </div>

            <div className="border border-zinc-200/60 rounded-xl bg-zinc-50/20 overflow-hidden divide-y divide-zinc-100 shadow-3xs">
              {(showAllLogs ? logs : logs.slice(0, 3)).map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 flex items-start gap-3 text-xs hover:bg-zinc-50/50 transition-colors"
                >
                  <div className="h-6 w-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[9px] uppercase shrink-0 font-mono">
                    {log.user.name.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-4">
                      <p className="font-bold text-zinc-700 truncate">
                        {log.user.name}
                      </p>
                      <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-[11px] mt-0.5 leading-snug">
                      {log.description}
                    </p>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <p className="p-4 text-center text-xs text-zinc-400 font-medium italic">
                  No structural ecosystem mutations logs tracked yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* METADATA MANIPULATION CONTROLS SIDEBAR */}
        <div className="w-full md:w-72 bg-zinc-50/60 p-5 border-t md:border-t-0 md:border-l border-zinc-200 flex flex-col justify-between gap-6 shrink-0">
          <div className="space-y-4 relative">
            {/* WINDOW CONTROL TOP BAR */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80">
              <span className="text-[10px] font-bold font-mono text-zinc-400 tracking-tight uppercase">
                GUID // {task.id.substring(0, 8)}
              </span>
              <button
                onClick={onClose}
                className="p-1 hover:bg-zinc-200/60 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* PREMIUM DYNAMIC INTERACTIVE CUSTOM STATUS CONTROLLER */}
            <div className="space-y-1 relative">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 select-none">
                <TrendingUp className="h-3 w-3" /> System Pipeline State
              </label>
              <button
                onClick={() =>
                  setActiveMenu(activeMenu === "status" ? null : "status")
                }
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 hover:border-zinc-300 transition shadow-3xs cursor-pointer text-left"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "h-2 w-2 rounded-full",
                      STATUS_CONFIG[task.status]?.dot,
                    )}
                  />
                  {STATUS_CONFIG[task.status]?.label}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {activeMenu === "status" && (
                <div className="absolute z-30 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-xl p-1 divide-y divide-zinc-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
                  {(
                    Object.keys(STATUS_CONFIG) as Array<
                      keyof typeof STATUS_CONFIG
                    >
                  ).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        handleSelectField("status", key);
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 text-left text-xs font-medium rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={clsx(
                            "h-1.5 w-1.5 rounded-full",
                            STATUS_CONFIG[key].dot,
                          )}
                        />
                        {STATUS_CONFIG[key].label}
                      </span>
                      {task.status === key && (
                        <Check className="h-3 w-3 text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PREMIUM DYNAMIC INTERACTIVE CUSTOM PRIORITY CONTROLLER */}
            <div className="space-y-1 relative">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 select-none">
                <AlertCircle className="h-3 w-3" /> Priority Core Classification
              </label>
              <button
                onClick={() =>
                  setActiveMenu(activeMenu === "priority" ? null : "priority")
                }
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 hover:border-zinc-300 transition shadow-3xs cursor-pointer text-left"
              >
                <span
                  className={clsx(
                    "font-bold text-xs",
                    PRIORITY_CONFIG[task.priority]?.text,
                  )}
                >
                  {PRIORITY_CONFIG[task.priority]?.label}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {activeMenu === "priority" && (
                <div className="absolute z-30 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-xl p-1 divide-y divide-zinc-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
                  {(
                    Object.keys(PRIORITY_CONFIG) as Array<
                      keyof typeof PRIORITY_CONFIG
                    >
                  ).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        handleSelectField("priority", key);
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 text-left text-xs font-medium rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <span className={PRIORITY_CONFIG[key].text}>
                        {PRIORITY_CONFIG[key].label}
                      </span>
                      {task.priority === key && (
                        <Check className="h-3 w-3 text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GRID LAYOUT FOR METRICS BLOCK */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* CLEAN ESTIMATE FIELD INPUT */}
              <div className="bg-white border border-zinc-200 rounded-xl p-2.5 shadow-3xs hover:border-zinc-300 transition group focus-within:ring-2 focus-within:ring-indigo-500/5 focus-within:border-indigo-500">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 select-none">
                  <Clock className="h-2.5 w-2.5 text-zinc-300 group-hover:text-zinc-400 transition-colors" />{" "}
                  Capacity
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    value={localEstimate}
                    onChange={(e) => handleEstimateChange(e.target.value)}
                    className="w-full text-xs font-mono font-bold text-zinc-800 border-0 p-0 focus:ring-0 outline-none placeholder-zinc-300"
                    placeholder="None"
                    min="0"
                  />
                  {localEstimate && (
                    <span className="text-[10px] font-mono font-bold text-zinc-400">
                      hr
                    </span>
                  )}
                </div>
              </div>

              {/* CLEAN TARGET DUE DATE FIELD INPUT */}
              <div className="bg-white border border-zinc-200 rounded-xl p-2.5 shadow-3xs hover:border-zinc-300 transition group focus-within:ring-2 focus-within:ring-indigo-500/5 focus-within:border-indigo-500 relative overflow-hidden">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 select-none">
                  <Calendar className="h-2.5 w-2.5 text-zinc-300 group-hover:text-zinc-400 transition-colors" />{" "}
                  Deadline
                </p>
                <input
                  type="date"
                  value={localDueDate}
                  onChange={(e) => handleDueDateChange(e.target.value)}
                  className="w-full text-xs font-mono font-bold text-zinc-800 border-0 p-0 focus:ring-0 outline-none mt-1 cursor-pointer bg-transparent relative z-10"
                />
              </div>
            </div>

            {/* SUITE TEAM NODES ASSIGNED SECTION */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 select-none">
                <User className="h-3 w-3" /> Allocated Project Resource Nodes
              </label>
              <div className="flex flex-wrap gap-1">
                {task.assignees?.length ? (
                  task.assignees.map((a) => (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-white text-zinc-600 border border-zinc-200 px-2 py-1 rounded-lg shadow-3xs cursor-default"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {a.user.name}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 font-medium italic select-none">
                    <HelpCircle className="h-3 w-3 text-zinc-300" />{" "}
                    Floating/Unallocated Backlog Asset
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS ACTIONS PANEL BOTTOM SEGMENT */}
          <button
            onClick={() => {
              handleBlurField("title", localTitle);
              handleBlurField("description", localDesc);
              onClose();
            }}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-sm active:scale-[0.98] transition-all cursor-pointer select-none"
          >
            Close Workspace Context
          </button>
        </div>
      </div>
    </div>
  );
}
