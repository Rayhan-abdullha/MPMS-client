// components/BoardColumn.tsx

import { Droppable } from "@hello-pangea/dnd";

import { MoreHorizontal, Plus } from "lucide-react";

import TaskCard from "./TaskCard";
import { clsx } from "clsx";

interface Props {
  column: any;
  tasks: any[];
  onAddTask: () => void;
}

export default function BoardColumn({ column, tasks, onAddTask }: Props) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold">{column.title}</h3>

          <span className="text-xs font-bold px-2 py-0.5 bg-zinc-200 rounded-md">
            {tasks.length}
          </span>
        </div>

        <button>
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              "p-3 flex-1 space-y-3 min-h-[150px]",
              snapshot.isDraggingOver && "bg-indigo-50/40",
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="p-2 border-t">
        <button
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold"
        >
          <Plus className="h-3.5 w-3.5" />
          Add New Task Card
        </button>
      </div>
    </div>
  );
}
