"use client";

import { Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { clsx } from "clsx";
import { Task } from "../hooks/useBoard";

interface Props {
  column: { id: string; title: string };
  tasks: Task[];
  sprintId: string;
  onAddTask: () => void;
  onViewDetails: (task: Task) => void;
}

export default function BoardColumn({
  column,
  tasks,
  sprintId,
  onAddTask,
  onViewDetails,
}: Props) {
  console.log(tasks);
  return (
    <div className="bg-zinc-50/60 border border-zinc-200/80 rounded-2xl flex flex-col max-h-[75vh]">
      <div className="p-4 flex items-center justify-between border-b border-zinc-200/60 bg-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-zinc-800 tracking-tight">
            {column.title}
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 bg-zinc-100 text-zinc-600 border border-zinc-200/60 rounded-md font-mono">
            {tasks.length}
          </span>
        </div>
        <button className="p-1 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              "p-3 flex-1 space-y-3 overflow-y-auto min-h-[200px] transition-colors custom-scrollbar",
              snapshot.isDraggingOver && "bg-indigo-50/30",
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                sprintId={sprintId}
                onViewDetails={onViewDetails}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="p-2 border-t border-zinc-200/60 bg-white rounded-b-2xl">
        <button
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50/50 border border-dashed border-zinc-200 hover:border-indigo-200 rounded-xl transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Task Asset
        </button>
      </div>
    </div>
  );
}
