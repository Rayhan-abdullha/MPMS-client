// dashboard/navigation.ts
import { FolderGit2, Layers, CheckSquare, Users, Settings } from "lucide-react";

export interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navigationItems: SidebarItem[] = [
  { name: "Projects", href: "/dashboard/projects", icon: FolderGit2 },
  { name: "Sprints & Board", href: "/dashboard/board", icon: Layers },
  { name: "My Tasks", href: "/dashboard/my-task", icon: CheckSquare },
  { name: "Team Members", href: "/dashboard/team", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];
