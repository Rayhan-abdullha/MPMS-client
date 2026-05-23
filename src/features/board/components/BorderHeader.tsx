// components/BoardHeader.tsx

import { Plus } from "lucide-react";

interface Props {
  userRole: string;
  onAddTask: () => void;
}

export default function BoardHeader({ userRole, onAddTask }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Sprint Kanban Engine
        </h1>

        <p className="text-sm text-zinc-500 mt-1">
          Active Scope:
          <span className="font-semibold text-zinc-800">
            {" "}
            Sprint Lifecycle Alpha 04 ({userRole} Control Panel)
          </span>
        </p>
      </div>

      <button
        onClick={onAddTask}
        className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Task Card
      </button>
    </div>
  );
}
