// components/TaskCard.tsx

import { Draggable } from "@hello-pangea/dnd";
import {
  MessageSquare,
  Paperclip,
  User,
} from "lucide-react";

import { clsx } from "clsx";

interface Props {
  task: any;
  index: number;
}

const getPriorityStyles = (priority: string) => {
  const schemas: Record<string, string> = {
    CRITICAL: "bg-red-50 text-red-700 border-red-100",
    HIGH: "bg-amber-50 text-amber-700 border-amber-100",
    MEDIUM: "bg-indigo-50 text-indigo-700 border-indigo-100",
    LOW: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  return schemas[priority] || schemas.LOW;
};

export default function TaskCard({
  task,
  index,
}: Props) {

    
  return (
    <Draggable
      draggableId={task.id}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className={clsx(
            "bg-white border rounded-xl p-4",
            snapshot.isDragging
              ? "border-indigo-600 shadow-md"
              : "border-zinc-200"
          )}
        >
          <div>
            <div className="flex items-start justify-between mb-2">
              <span
                className={clsx(
                  "px-2 py-0.5 text-[10px] font-bold border rounded-md uppercase",
                  getPriorityStyles(task.priority)
                )}
              >
                {task.priority}
              </span>

              <span className="text-[11px] text-zinc-400 font-mono">
                #{task.id}
              </span>
            </div>

            <h4 className="text-sm font-bold">
              {task.title}
            </h4>

            <p className="text-xs text-zinc-500 mt-1">
              {task.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <div className="flex items-center gap-1 text-[11px]">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>2</span>
              </div>

              <div className="flex items-center gap-1 text-[11px]">
                <Paperclip className="h-3.5 w-3.5" />
                <span>1</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium">
                {task.assignee?.name}
              </span>

              <div className="h-6 w-6 rounded-full bg-zinc-100 border flex items-center justify-center">
                <User className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}