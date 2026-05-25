"use client";

import { useState } from "react";
import {
  X,
  Clock,
  Calendar,
  MessageSquare,
  Send,
  CornerDownRight,
  History,
  Trash2,
  CheckCircle,
} from "lucide-react";

import { Task, useBoard, TaskPriority, TaskStatus } from "../hooks/useBoard";
import useUserRole from "../hooks/useUserRole";

interface Props {
  task: Task;
  sprintId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailsModal({
  task,
  sprintId,
  isOpen,
  onClose,
}: Props) {
  const role = useUserRole();
  const isAdmin = role === "ADMIN" || role === "MANAGER";

  const [commentText, setCommentText] = useState("");
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState(task.description || "");
  const [titleInput, setTitleInput] = useState(task.title);
  const [showAllActivities, setShowAllActivities] = useState(false);

  const { useUpdateTaskDetails, useDeleteTask, useAddComment } = useBoard();

  const { mutate: updateTask } = useUpdateTaskDetails(sprintId);
  const { mutate: deleteTask } = useDeleteTask(sprintId);
  const { mutate: addComment } = useAddComment(sprintId, task.id);

  if (!isOpen) return null;

  const handleUpdateTask = (payload: Partial<Task>) => {
    updateTask({
      taskId: task.id,
      payload,
    });
  };

  const handleDeleteTask = () => {
    if (
      confirm("Are you sure you want to permanently delete this task asset?")
    ) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handlePostComment = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();

    const text = parentId ? replyText : commentText;
    if (!text.trim()) return;

    addComment(
      { text, parentId },
      {
        onSuccess: () => {
          if (parentId) {
            setReplyText("");
            setReplyTargetId(null);
          } else {
            setCommentText("");
          }
        },
      },
    );
  };

  const activities = [...(task.activities || [])].reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 antialiased animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[4px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12 max-h-[85vh]">
        {/* LEFT */}
        <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 border-b md:border-b-0 md:border-r border-zinc-100 max-h-[85vh] custom-scrollbar">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">
              Asset Node #{task.id}
            </span>

            {isAdmin && (
              <button
                onClick={handleDeleteTask}
                className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* TITLE */}
          <div className="space-y-1">
            {isAdmin ? (
              <input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={() =>
                  handleUpdateTask({
                    title: titleInput,
                  })
                }
                className="w-full text-base font-bold text-zinc-900 tracking-tight border-none outline-none bg-transparent"
              />
            ) : (
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                {task.title}
              </h2>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Description Scope
            </label>

            {isEditingDesc && isAdmin ? (
              <div className="space-y-2">
                <textarea
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  rows={4}
                  className="w-full text-xs font-medium text-zinc-800 border rounded-xl p-3 resize-none outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />

                <div className="flex gap-1.5 justify-end">
                  <button
                    onClick={() => setIsEditingDesc(false)}
                    className="px-2.5 py-1 text-[11px] border rounded-md text-zinc-500"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      handleUpdateTask({
                        description: descInput,
                      });
                      setIsEditingDesc(false);
                    }}
                    className="px-2.5 py-1 text-[11px] bg-zinc-900 text-white rounded-md font-bold"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => isAdmin && setIsEditingDesc(true)}
                className="text-xs font-medium text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-xl p-3 cursor-pointer hover:bg-zinc-100/50 transition-colors leading-relaxed min-h-[60px]"
              >
                {task.description || (
                  <span className="text-zinc-400 italic">
                    No task metrics mapped.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* COMMENTS */}
          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              Threaded Conversation
            </label>

            <form onSubmit={(e) => handlePostComment(e)} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a message..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-zinc-200 rounded-xl outline-none focus:border-indigo-600"
              />

              <button
                type="submit"
                className="p-2 bg-indigo-600 text-white rounded-xl"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-5 bg-zinc-50/50 p-6 flex flex-col justify-between max-h-[85vh]">
          <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {/* STATUS */}
            <select
              disabled={!isAdmin}
              value={task.status}
              onChange={(e) =>
                handleUpdateTask({
                  status: e.target.value as TaskStatus,
                })
              }
              className="w-full text-xs font-semibold border bg-white border-zinc-200 rounded-xl px-3 py-2"
            >
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review Required</option>
              <option value="DONE">Done</option>
            </select>

            {/* PRIORITY */}
            <select
              disabled={!isAdmin}
              value={task.priority}
              onChange={(e) =>
                handleUpdateTask({
                  priority: e.target.value as TaskPriority,
                })
              }
              className="w-full text-xs font-semibold border bg-white border-zinc-200 rounded-xl px-3 py-2"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            {/* ESTIMATE + DATE */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white border border-zinc-100 p-2.5 rounded-xl">
              <input
                type="number"
                disabled={!isAdmin}
                value={task.estimateHours || ""}
                onChange={(e) =>
                  handleUpdateTask({
                    estimateHours: Number(e.target.value),
                  })
                }
                className="border rounded-lg px-2 py-1"
                placeholder="Hours"
              />

              <input
                type="date"
                disabled={!isAdmin}
                value={task.dueDate?.split("T")[0] || ""}
                onChange={(e) =>
                  handleUpdateTask({
                    dueDate: e.target.value,
                  })
                }
                className="border rounded-lg px-2 py-1"
              />
            </div>

            {/* ACTIVITY LOG */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowAllActivities(!showAllActivities)}
                className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400"
              >
                <span className="flex items-center gap-1">
                  <History className="h-3.5 w-3.5" />
                  Activity Log
                </span>

                <span className="text-indigo-600">
                  {showAllActivities ? "Show Less" : "View All"}
                </span>
              </button>

              <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar text-[10px]">
                {(showAllActivities ? activities : activities.slice(0, 4)).map(
                  (log) => (
                    <div key={log.id} className="flex gap-1.5 items-start">
                      <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />

                      <div>
                        <p className="text-zinc-700">{log.type}</p>

                        <span className="text-[9px] text-zinc-400 font-mono">
                          {log.user?.name || log.user?.email} •{" "}
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
