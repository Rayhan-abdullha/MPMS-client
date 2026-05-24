export interface ActivityLog {
  taskId: string;
  createdAt: string;
  type: string;
  description: string;
  user: {
    name: string;
    email: string;
  };
}

export interface AssignedTask {
  id: string;
  title: string;
  description: string | null;
  estimateHours: number | null;
  dueDate: string | null;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  projectId: string;
  sprintId: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    title: string;
  };
  sprint?: {
    id: string;
    title: string;
    sprintNumber: number;
  };
  assignees?: Array<{
    id: string;
    userId: string;
    user: { name: string; email: string };
  }>;
  activityLogs?: ActivityLog[];
}

export interface User {
  id: string;
  name: string;
}
export interface TaskAssignee {
  id: string;
  taskId: string;
  userId: string;
  assignedAt: string;
  user: User;
}
export interface Project {
  id: string;
  title: string;
}
export interface Sprint {
  id: string;
  title: string;
  sprintNumber: number;
}
