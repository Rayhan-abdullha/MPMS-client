"use client";

import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { Clock, Calendar, MessageSquare, Edit2 } from "lucide-react";
import { Task } from "../hooks/useBoard";

interface Props {
  task: Task;
  index: number;
  onViewDetails: (task: Task) => void;
}

export default function TaskCard({ task, index, onViewDetails }: Props) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const priorityColors = {
    LOW: "bg-zinc-100 text-zinc-700 border-zinc-200",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
    HIGH: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => !isEditingTitle && onViewDetails(task)}
          className={`cursor-pointer p-4 rounded-xl border bg-white border-zinc-200 shadow-xs hover:border-zinc-300 transition-all select-none group flex flex-col gap-2.5 relative ${
            snapshot.isDragging
              ? "shadow-xl ring-2 ring-indigo-600/10 border-indigo-500"
              : ""
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`px-2 py-0.5 font-bold font-mono text-[9px] border rounded-md uppercase tracking-wider ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                className="p-1 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700 rounded"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug group-hover:text-indigo-600 transition-colors">
            {task.title}
          </h4>

          {task.description && (
            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              {task.estimateHours && (
                <span className="flex items-center gap-0.5 font-mono">
                  <Clock className="h-3 w-3 text-zinc-300" />{" "}
                  {task.estimateHours}h
                </span>
              )}
              {task.dueDate && (
                <span className="flex items-center gap-0.5 font-mono">
                  <Calendar className="h-3 w-3 text-zinc-300" />{" "}
                  {new Date(task.dueDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {task.comments && task.comments.length > 0 && (
                <span className="flex items-center gap-0.5">
                  <MessageSquare className="h-3 w-3 text-zinc-300" />{" "}
                  {task.comments.length}
                </span>
              )}
              <div className="flex -space-x-1 overflow-hidden">
                {task.assignedUsers?.map((u) => (
                  <div
                    key={u.id}
                    title={u.email}
                    className="h-4.5 w-4.5 rounded-full border border-white bg-zinc-100 text-[8px] font-bold text-zinc-600 flex items-center justify-center ring-1 ring-zinc-200"
                  >
                    {u.name
                      ? u.name.substring(0, 2).toUpperCase()
                      : u.email.substring(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
