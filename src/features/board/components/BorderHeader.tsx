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

      {userRole === "ADMIN" || userRole === "MANAGER" ? (
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 text-sm font-semibold text-brand-primary"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      ) : null}
    </div>
  );
}
