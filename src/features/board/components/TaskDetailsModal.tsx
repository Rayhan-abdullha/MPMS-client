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
import {
  Task,
  Comment,
  useBoard,
  TaskPriority,
  TaskStatus,
} from "../hooks/useBoard";

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
  const [commentText, setCommentText] = useState("");
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState(task.description || "");

  const { useUpdateTaskDetails, useDeleteTask, useAddComment } = useBoard();
  const { mutate: updateDetails } = useUpdateTaskDetails(sprintId);
  const { mutate: deleteTask } = useDeleteTask(sprintId);
  const { mutate: addComment } = useAddComment(sprintId, task.id);

  if (!isOpen) return null;

  const handleUpdatePriority = (priority: TaskPriority) => {
    updateDetails({ taskId: task.id, payload: { priority } });
  };

  const handleUpdateStatus = (status: TaskStatus) => {
    updateDetails({ taskId: task.id, payload: { status } });
  };

  const handleSaveDescription = () => {
    updateDetails({ taskId: task.id, payload: { description: descInput } });
    setIsEditingDesc(false);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 antialiased animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[4px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12 max-h-[85vh]">
        {/* Left Side: Parameters Form, Context Elements */}
        <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 border-b md:border-b-0 md:border-r border-zinc-100 max-h-[85vh] custom-scrollbar">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">
              Asset Node #{task.id}
            </span>
            <button
              onClick={handleDeleteTask}
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              {task.title}
            </h2>
          </div>

          {/* Description Block */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Description Scope
            </label>
            {isEditingDesc ? (
              <div className="space-y-2">
                <textarea
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full text-xs font-medium text-zinc-800 border rounded-xl p-3 outline-none focus:border-indigo-600 leading-relaxed resize-none"
                  rows={3}
                />
                <div className="flex gap-1.5 justify-end">
                  <button
                    onClick={() => setIsEditingDesc(false)}
                    className="px-2.5 py-1 text-[11px] border rounded-md text-zinc-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDescription}
                    className="px-2.5 py-1 text-[11px] bg-zinc-900 text-white rounded-md font-bold"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingDesc(true)}
                className="text-xs font-medium text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-xl p-3 cursor-pointer hover:bg-zinc-100/50 transition-colors leading-relaxed min-h-[60px]"
              >
                {task.description || (
                  <span className="text-zinc-400 italic">
                    No task metrics mapped. Click to append acceptance
                    parameters.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Core Threaded Comments UI */}
          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" /> Threaded Conversation
            </label>

            {/* Comment Ingestion Input Form */}
            <form onSubmit={(e) => handlePostComment(e)} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a message inside this lifecycle thread..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-zinc-200 rounded-xl outline-none focus:border-indigo-600 font-medium"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Thread Canvas */}
            <div className="space-y-3 mt-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              {task.comments
                ?.filter((c) => !c.parentId)
                .map((comment) => (
                  <div key={comment.id} className="space-y-2 text-xs">
                    <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-2.5">
                      <div className="flex items-center justify-between font-bold text-[11px] text-zinc-800">
                        <span>{comment.user?.name || comment.user?.email}</span>
                        <span className="text-[9px] font-medium text-zinc-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-zinc-600 font-medium mt-1 leading-normal">
                        {comment.text}
                      </p>
                      <button
                        onClick={() =>
                          setReplyTargetId(
                            replyTargetId === comment.id ? null : comment.id,
                          )
                        }
                        className="text-[10px] font-bold text-indigo-600 mt-1.5 block hover:underline"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Nested Replies Rendering */}
                    {task.comments
                      ?.filter((r) => r.parentId === comment.id)
                      .map((reply) => (
                        <div
                          key={reply.id}
                          className="flex gap-1 pl-4 items-start animate-in slide-in-from-left-2 duration-100"
                        >
                          <CornerDownRight className="h-3.5 w-3.5 text-zinc-300 mt-2 shrink-0" />
                          <div className="bg-zinc-50/50 border border-zinc-100 rounded-xl p-2.5 flex-1">
                            <div className="flex items-center justify-between font-bold text-[11px] text-zinc-800">
                              <span>
                                {reply.user?.name || reply.user?.email}
                              </span>
                              <span className="text-[9px] font-medium text-zinc-400">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-zinc-600 font-medium mt-1 leading-normal">
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      ))}

                    {/* Inline Reply Input Field Box */}
                    {replyTargetId === comment.id && (
                      <form
                        onSubmit={(e) => handlePostComment(e, comment.id)}
                        className="flex gap-2 pl-4 animate-in fade-in duration-150"
                      >
                        <input
                          type="text"
                          placeholder="Write a nested reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 text-xs border border-zinc-200 rounded-lg outline-none focus:border-indigo-600 font-medium"
                        />
                        <button
                          type="submit"
                          className="px-2.5 bg-zinc-900 text-white rounded-lg text-[11px] font-bold"
                        >
                          Reply
                        </button>
                      </form>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Side: Execution Controls, Lifecycle Audit Log Tracks */}
        <div className="md:col-span-5 bg-zinc-50/50 p-6 flex flex-col justify-between max-h-[85vh]">
          <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            <div className="flex justify-end md:hidden">
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* In-Place Status Lane Update Selector Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Workflow Lane State
              </label>
              <select
                value={task.status}
                onChange={(e) =>
                  handleUpdateStatus(e.target.value as TaskStatus)
                }
                className="w-full text-xs font-semibold border bg-white border-zinc-200 rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-indigo-600"
              >
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review Required</option>
                <option value="DONE">Done / Dispatched</option>
              </select>
            </div>

            {/* In-Place Priority Update Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Priority Group
              </label>
              <select
                value={task.priority}
                onChange={(e) =>
                  handleUpdatePriority(e.target.value as TaskPriority)
                }
                className="w-full text-xs font-semibold border bg-white border-zinc-200 rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-indigo-600"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Performance Parameters Summary Block */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white border border-zinc-100 p-2.5 rounded-xl">
              <div>
                <span className="text-zinc-400 block font-medium flex items-center gap-0.5">
                  <Clock className="h-3 w-3" /> Estimate
                </span>
                <b className="text-zinc-800 font-mono text-xs">
                  {task.estimateHours ? `${task.estimateHours} hrs` : "Unset"}
                </b>
              </div>
              <div>
                <span className="text-zinc-400 block font-medium flex items-center gap-0.5">
                  <Calendar className="h-3 w-3" /> Deadline
                </span>
                <b className="text-zinc-800 font-mono text-xs">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "Unset"}
                </b>
              </div>
            </div>

            {/* Operational Audit Log Matrix */}
            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <History className="h-3.5 w-3.5" /> Activity Log
              </label>
              <div className="space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar text-[10px] font-medium text-zinc-500">
                {task.activities?.map((log) => (
                  <div key={log.id} className="flex gap-1.5 items-start">
                    <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-zinc-700 leading-tight">{log.type}</p>
                      <span className="text-[9px] text-zinc-400 font-mono">
                        {log.user?.name || log.user?.email} •{" "}
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {(!task.activities || task.activities.length === 0) && (
                  <span className="italic text-zinc-400 block py-1">
                    No immutable traces logged.
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer hidden md:block"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
