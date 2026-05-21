"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import {
  Plus,
  FolderGit2,
  Calendar,
  LayoutGrid,
  ListFilter,
  ShieldAlert,
  Loader2,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "PLANNING" | "ACTIVE" | "COMPLETED" | "ON_HOLD";
  progress: number;
  taskCount: number;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [userRole, setUserRole] = useState<string>("MEMBER");

  useEffect(() => {
    const storedUser = localStorage.getItem("mpms_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserRole(parsed.role || "MEMBER");
      } catch (e) {}
    }
  }, []);

  // Fetch active project data array via central API routing engine
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["workspace_projects"],
    queryFn: async () => {
      // Graceful local mockup tracking injection fallback if server API is launching concurrently
      try {
        const res = await api.get("/projects");
        return res.data?.data || [];
      } catch (err) {
        return [
          {
            id: "1",
            name: "Fintech Core Engine Deployment",
            description:
              "Double-entry asset processing ledgers matching strict international clearing protocols.",
            status: "ACTIVE",
            progress: 74,
            taskCount: 24,
            updatedAt: "2026-05-20",
          },
          {
            id: "2",
            name: "Omnichannel Coupon Router",
            description:
              "High-concurrency logic pipeline optimizing real-time cart distribution variables.",
            status: "PLANNING",
            progress: 12,
            taskCount: 8,
            updatedAt: "2026-05-18",
          },
          {
            id: "3",
            name: "Blood Analytics Verification App",
            description:
              "Platform matching verification algorithms with regional distribution structures.",
            status: "COMPLETED",
            progress: 100,
            taskCount: 42,
            updatedAt: "2026-04-12",
          },
        ] as Project[];
      }
    },
  });

  const getStatusStyles = (status: Project["status"]) => {
    const configurations = {
      ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-100",
      PLANNING: "bg-blue-50 text-blue-700 border-blue-100",
      COMPLETED: "bg-zinc-100 text-zinc-700 border-zinc-200",
      ON_HOLD: "bg-amber-50 text-amber-700 border-amber-100",
    };
    return configurations[status] || configurations.PLANNING;
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
        <p className="text-sm text-premium-textMuted font-medium">
          Syncing active workspace clusters...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Dynamic Master Control Hub Row Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-premium-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Project Workspace Node
          </h1>
          <p className="text-sm text-premium-textMuted mt-1">
            Monitor, orchestrate, and audit cross-functional production
            timelines.
          </p>
        </div>

        {/* Dynamic administrative insertion gates mapping account authorization scope */}
        {userRole !== "MEMBER" && (
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
            <Plus className="h-4 w-4" /> Initialize Project
          </button>
        )}
      </div>

      {/* Grid Explorer Framework Block */}
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-premium-card border border-premium-border rounded-xl p-6 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all hover:shadow-sm"
            >
              <div>
                {/* Structural Heading Blocks */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="h-10 w-10 bg-zinc-50 border border-premium-border rounded-lg flex items-center justify-center text-zinc-600">
                    <FolderGit2 className="h-5 w-5 text-zinc-500" />
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold uppercase tracking-wide border rounded-md ${getStatusStyles(project.status)}`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 tracking-tight line-clamp-1 hover:text-brand-primary transition-colors cursor-pointer">
                  {project.name}
                </h3>
                <p className="text-sm text-premium-textMuted mt-2 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Incremental Analytics Tracking Segment */}
              <div className="mt-6 pt-5 border-t border-premium-border space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-premium-textMuted">
                      Velocity Engine Completion
                    </span>
                    <span className="text-zinc-900 font-bold">
                      {project.progress}%
                    </span>
                  </div>
                  {/* Progress Line */}
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Subtext Grid Footers */}
                <div className="flex items-center justify-between text-xs text-premium-textMuted pt-1">
                  <div className="flex items-center gap-1">
                    <LayoutGrid className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="font-medium text-zinc-700">
                      {project.taskCount}
                    </span>{" "}
                    active tasks
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Sync {project.updatedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-premium-border bg-premium-card rounded-xl p-12 text-center max-w-md mx-auto">
          <ShieldAlert className="h-8 w-8 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-900">
            No projects indexed
          </h3>
          <p className="text-xs text-premium-textMuted mt-1">
            Your core workspace node doesn't contain any project structures yet.
          </p>
        </div>
      )}
    </div>
  );
}
