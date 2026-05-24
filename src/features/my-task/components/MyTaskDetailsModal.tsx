"use client";
interface ModalProps {
  task: AssignedTask;
  isOpen: boolean;
  onClose: () => void;
}
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
} from "lucide-react";
import { AssignedTask } from "../MyTask.types";
import { useState } from "react";
export function MyTaskDetailsModal({ task, isOpen, onClose }: ModalProps) {
  //   const { useUpdateTaskFields } = useBoard(); // Implement an overarching field mutation handler
  //   const { mutate: updateField } = useUpdateTaskFields?.() || { mutate: () => {} };

  const [localTitle, setLocalTitle] = useState(task.title);
  const [localDesc, setLocalDesc] = useState(task.description || "");

  if (!isOpen) return null;

  const handleBlurField = (
    fieldName: "title" | "description",
    value: string,
  ) => {
    if (value === task[fieldName]) return;
    // updateField({ taskId: task.id, [fieldName]: value });
  };

  const handleSelectField = (
    fieldName: "status" | "priority",
    value: string,
  ) => {
    // updateField({ taskId: task.id, [fieldName]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        {/* MAIN FIELDS INPUT ZONE */}
        <div className="flex-1 p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* PARENT PATH CRUMB */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <FolderKanban className="h-3.5 w-3.5 text-zinc-300" />
            <span>{task.project?.title || "System Architecture"}</span>
            <span>/</span>
            <span>{task.sprint?.title || "Sprint Core"}</span>
            <span className="font-mono bg-zinc-100 text-zinc-500 px-1 rounded">
              #{task.sprint?.sprintNumber || 1}
            </span>
          </div>

          {/* DYNAMIC INLINE TITLE INPUT */}
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={() => handleBlurField("title", localTitle)}
            className="w-full text-base font-bold text-zinc-900 border-0 p-0 focus:ring-0 focus:bg-zinc-50/50 rounded-lg placeholder-zinc-300 tracking-tight"
            placeholder="Untitled Task Asset"
          />

          {/* DESCRIPTION TEXTAREA */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <FileText className="h-3 w-3" /> Scope Details Description
            </label>
            <textarea
              value={localDesc}
              onChange={(e) => setLocalDesc(e.target.value)}
              onBlur={() => handleBlurField("description", localDesc)}
              className="w-full text-xs text-zinc-600 bg-zinc-50/50 border border-zinc-200 rounded-xl p-3 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/5 min-h-[100px] resize-none leading-relaxed transition-all"
              placeholder="Inject actionable technical definitions here..."
            />
          </div>

          {/* IMMUTABLE HISTORICAL ACTIVITY LOG TRACKER */}
          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="h-3 w-3" /> Audit Evolution Trail (
              {task.activityLogs?.length || 0})
            </label>
            <div className="border border-zinc-200/60 rounded-xl bg-zinc-50/30 overflow-hidden divide-y divide-zinc-100">
              {task.activityLogs && task.activityLogs.length > 0 ? (
                task.activityLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-start gap-3 hover:bg-zinc-50/50 transition-colors text-xs"
                  >
                    <div className="h-6 w-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0 uppercase font-mono">
                      {log.user.name.substring(0, 2)}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-zinc-800">
                          {log.user.name}
                        </p>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {new Date(log.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-[11px] font-medium leading-relaxed">
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-center text-xs text-zinc-400 italic">
                  No ecosystem modifications recorded.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CONTROLS SIDEBAR DRAWER */}
        <div className="w-full md:w-72 bg-zinc-50/80 p-6 border-t md:border-t-0 md:border-l border-zinc-200 flex flex-col justify-between gap-6 shrink-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span className="text-xs font-bold text-zinc-700 font-mono tracking-tight">
                {task.id.substring(0, 12)}
              </span>
              <button
                onClick={onClose}
                className="p-1 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* STATUS CONFIG SELECT */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Workspace State
              </label>
              <select
                value={task.status}
                onChange={(e) => handleSelectField("status", e.target.value)}
                className="w-full text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review Required</option>
                <option value="DONE">Completed / Dispatched</option>
              </select>
            </div>

            {/* PRIORITY CONFIG SELECT */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Priority Tier
              </label>
              <select
                value={task.priority}
                onChange={(e) => handleSelectField("priority", e.target.value)}
                className="w-full text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer"
              >
                <option value="LOW">Low Allocation</option>
                <option value="MEDIUM">Medium Level</option>
                <option value="HIGH">High Criticality</option>
              </select>
            </div>

            {/* METRICS DISPLAYS */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
              <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
                <p className="text-[10px] font-bold text-zinc-400 uppercase">
                  Estimate
                </p>
                <p className="font-mono font-bold text-zinc-700 mt-0.5 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />{" "}
                  {task.estimateHours ? `${task.estimateHours}h` : "N/A"}
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
                <p className="text-[10px] font-bold text-zinc-400 uppercase">
                  Target Date
                </p>
                <p className="font-mono font-bold text-zinc-700 mt-0.5 flex items-center gap-1 truncate">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    : "Unset"}
                </p>
              </div>
            </div>

            {/* TEAM ASSIGNEES MATRIX GRID */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <User className="h-3 w-3" /> Assigned Nodes
              </label>
              <div className="flex flex-wrap gap-1.5">
                {task.assignees && task.assignees.length > 0 ? (
                  task.assignees.map((a) => (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-white text-zinc-600 border border-zinc-200 px-2 py-1 rounded-md shadow-2xs"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                      {a.user.name}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-zinc-400 font-medium italic flex items-center gap-0.5">
                    <HelpCircle className="h-3 w-3" /> Floating Asset
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer"
          >
            Commit & Close
          </button>
        </div>
      </div>
    </div>
  );
}
