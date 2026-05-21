"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CreateProjectModal, {
  ProjectFormData,
} from "@/features/projects/components/CreateProjectModal";
import {
  Briefcase,
  Plus,
  Layers,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { clsx } from "clsx";

interface ProjectNode {
  id: string;
  title: string;
  client: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: "planned" | "active" | "completed" | "archived";
  thumbnailUrl?: string;
  stats: {
    tasksTotal: number;
    tasksCompleted: number;
  };
}

// Demo Data Only
const mockProjects: ProjectNode[] = [
  {
    id: "p-1",
    title: "Minimal Project Management Engine",
    client: "DataPollex Limited",
    description:
      "Construct a unified edge core handling multi-tenant agile task streams, RBAC middle proxies, and performance chart components.",
    startDate: "2026-05-10",
    endDate: "2026-06-15",
    budget: 45000,
    status: "active",
    stats: { tasksTotal: 14, tasksCompleted: 9 },
  },
  {
    id: "p-2",
    title: "High-Concurrency Processing Hub",
    client: "Alien Technologies Corp",
    description:
      "Isolate ledger node tracking architectures across remote cluster environments with zero synchronization lock debt.",
    startDate: "2026-07-01",
    endDate: "2026-09-30",
    budget: 120000,
    status: "planned",
    stats: { tasksTotal: 8, tasksCompleted: 0 },
  },
  {
    id: "p-3",
    title: "Enterprise Analytics Dashboard",
    client: "Nova Dynamics",
    description:
      "Develop scalable visualization pipelines for operational intelligence metrics and KPI aggregation systems.",
    startDate: "2026-04-15",
    endDate: "2026-08-20",
    budget: 78000,
    status: "completed",
    stats: { tasksTotal: 24, tasksCompleted: 24 },
  },
];

export default function UnifiedProjectsDirectoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [userRole, setUserRole] = useState<"ADMIN" | "MANAGER" | "MEMBER">(
    "MEMBER",
  );

  // Demo session handling
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("mpms_user");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);

        if (parsed.role) {
          setUserRole(parsed.role.toUpperCase());
        }
      }
    } catch (e) {
      console.warn("Session extraction context error:", e);
    }
  }, []);

  // Management access gate
  const isManagementTier = userRole === "ADMIN" || userRole === "MANAGER";

  // Local demo data
  const projects = mockProjects;

  // Local project create simulation
  const handleCreateProject = async (data: ProjectFormData) => {
    console.log("Demo Project Submitted:", data);

    setIsModalOpen(false);
  };

  const getStatusBadgeStyles = (status: ProjectNode["status"]) => {
    const schemas = {
      planned: "bg-zinc-100 text-zinc-700 border-zinc-200",
      active: "bg-indigo-50 text-indigo-700 border-indigo-100",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
      archived: "bg-amber-50 text-amber-700 border-amber-100",
    };

    return schemas[status];
  };

  // Filtering logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || project.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <UserCheck className="h-3.5 w-3.5" />
            Identity Context: {userRole} Panel View
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-0.5">
            Workspace Repositories
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Consume active project streams, monitor delivery progress metrics,
            and manage agile milestones.
          </p>
        </div>

        {isManagementTier && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer outline-none shrink-0"
          >
            <Plus className="h-4 w-4" />
            Create Project Context
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search projects by title or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-zinc-900"
          />

          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="h-4 w-4 text-zinc-400" />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-sm outline-none font-medium text-zinc-700 cursor-pointer"
          >
            <option value="ALL">All Status States</option>
            <option value="PLANNED">Planned</option>
            <option value="ACTIVE">Active Execution</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
          <Briefcase className="h-8 w-8 text-zinc-300 mx-auto mb-2" />

          <p className="text-sm font-medium text-zinc-600">
            No workspace repositories found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const completionPercent =
              project.stats.tasksTotal > 0
                ? Math.round(
                    (project.stats.tasksCompleted / project.stats.tasksTotal) *
                      100,
                  )
                : 0;

            return (
              <div
                key={project.id}
                className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm group"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">
                        {project.client}
                      </span>

                      <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5 group-hover:text-indigo-600 transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    <span
                      className={clsx(
                        "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-md whitespace-nowrap",
                        getStatusBadgeStyles(project.status),
                      )}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 mb-5">
                    {project.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5" />
                        Sprint Task Delivery
                      </span>

                      <span className="text-zinc-900 font-mono">
                        {project.stats.tasksCompleted}/
                        {project.stats.tasksTotal} ({completionPercent}%)
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-zinc-100 border border-zinc-200/30 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget + Link */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="text-xs font-semibold text-zinc-600 flex items-center gap-0.5">
                      <DollarSign className="h-3.5 w-3.5 text-zinc-400" />

                      <span>
                        Budget:{" "}
                        <span className="text-zinc-900 font-bold font-mono">
                          ${project.budget.toLocaleString()}
                        </span>
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors group/link"
                    >
                      Enter Workspace
                      <ArrowRight className="h-3 w-3 transform group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        isPending={false}
      />
    </div>
  );
}
