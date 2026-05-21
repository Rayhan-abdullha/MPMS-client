"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  CheckCircle,
  Clock,
  MoreVertical,
  Search,
  Filter,
  Check,
  X,
} from "lucide-react";
import { clsx } from "clsx";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "GUEST";
  status: "ACTIVE" | "IDLE" | "OFFLINE";
  lastActive: string;
  tasksCompleted: number;
  activeSprints: number;
}

const mockTeam: TeamMember[] = [
  {
    id: "m-1",
    name: "Rayhan",
    email: "developer@rayhanfoods.com",
    role: "OWNER",
    status: "ACTIVE",
    lastActive: "Just now",
    tasksCompleted: 42,
    activeSprints: 3,
  },
  {
    id: "m-2",
    name: "Asif Rahman",
    email: "asif@performance-engine.io",
    role: "ADMIN",
    status: "ACTIVE",
    lastActive: "5m ago",
    tasksCompleted: 28,
    activeSprints: 3,
  },
  {
    id: "m-3",
    name: "Nisha Sultana",
    email: "nisha@dev.net",
    role: "MEMBER",
    status: "IDLE",
    lastActive: "42m ago",
    tasksCompleted: 19,
    activeSprints: 2,
  },
  {
    id: "m-4",
    name: "Fahim Ahmed",
    email: "fahim@partner-node.org",
    role: "GUEST",
    status: "OFFLINE",
    lastActive: "2 days ago",
    tasksCompleted: 4,
    activeSprints: 1,
  },
];

export default function TeamAdministrationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Query mapping team members configuration state arrays
  const { data: teamMembers } = useQuery<TeamMember[]>({
    queryKey: ["workspace_team"],
    queryFn: async () => {
      try {
        const res = await api.get("/team");
        return res.data?.data || mockTeam;
      } catch (err) {
        return mockTeam;
      }
    },
  });

  const getStatusColor = (status: TeamMember["status"]) => {
    const schemas = {
      ACTIVE: "bg-emerald-500 ring-emerald-100",
      IDLE: "bg-amber-500 ring-amber-100",
      OFFLINE: "bg-zinc-400 ring-zinc-100",
    };
    return schemas[status];
  };

  const getRoleBadgeStyles = (role: TeamMember["role"]) => {
    const schemas = {
      OWNER: "bg-indigo-50 text-indigo-700 border-indigo-100",
      ADMIN: "bg-purple-50 text-purple-700 border-purple-100",
      MEMBER: "bg-blue-50 text-blue-700 border-blue-100",
      GUEST: "bg-zinc-100 text-zinc-700 border-zinc-200",
    };
    return schemas[role];
  };

  const filteredMembers = teamMembers?.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Structural Module Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-premium-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Team Governance Matrix
          </h1>
          <p className="text-sm text-premium-textMuted mt-1">
            Provision corporate node access keys, regulate workspace
            permissions, and track active member velocity.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer outline-none">
          <UserPlus className="h-4 w-4" /> Provision Member
        </button>
      </div>

      {/* Roster Search Filters Navigation Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search team member alias or identity routing keys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-premium-border text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-white text-zinc-900"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="h-4 w-4 text-zinc-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-premium-border bg-white text-sm outline-none font-medium text-zinc-700 cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="OWNER">Owner Nodes</option>
            <option value="ADMIN">Administrators</option>
            <option value="MEMBER">Standard Members</option>
            <option value="GUEST">Guest Clusters</option>
          </select>
        </div>
      </div>

      {/* Roster Profiles Directory Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers?.map((member) => (
          <div
            key={member.id}
            className="bg-premium-card border border-premium-border rounded-xl p-5 shadow-xs flex flex-col justify-between relative hover:border-zinc-300 transition-all hover:shadow-sm"
          >
            <div>
              {/* Identity Row Card Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="relative">
                  <div className="h-11 w-11 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 shadow-inner text-sm uppercase">
                    {member.name.substring(0, 2)}
                  </div>
                  {/* Real-time pulse status indicator */}
                  <span
                    className={clsx(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 text-white flex items-center justify-center",
                      getStatusColor(member.status),
                    )}
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-md ${getRoleBadgeStyles(member.role)}`}
                  >
                    {member.role}
                  </span>
                  <button className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Roster Descriptive Identity Section */}
              <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                {member.name}
              </h3>
              <p className="text-xs text-premium-textMuted flex items-center gap-1.5 mt-1 font-mono">
                <Mail className="h-3.5 w-3.5 text-zinc-400" /> {member.email}
              </p>
            </div>

            {/* Velocity / Analytics Footer Container metrics */}
            <div className="mt-5 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-4 text-center">
              <div className="bg-zinc-50/60 border border-zinc-200/40 rounded-lg p-2">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-premium-textMuted">
                  Task Units
                </span>
                <span className="text-base font-bold text-zinc-900 flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />{" "}
                  {member.tasksCompleted}
                </span>
              </div>
              <div className="bg-zinc-50/60 border border-zinc-200/40 rounded-lg p-2">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-premium-textMuted">
                  Last Ping
                </span>
                <span className="text-xs font-semibold text-zinc-700 flex items-center justify-center gap-1 mt-1.5">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />{" "}
                  {member.lastActive}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- ENTERPRISE PERMISSIONS MATRIX LAYOUT BLOCK --- */}
      <div className="pt-4">
        <div className="bg-premium-card border border-premium-border rounded-xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-premium-border bg-white">
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-indigo-600" /> Role-Based
              Access Control (RBAC) Capability Model
            </h3>
            <p className="text-xs text-premium-textMuted mt-0.5">
              Audit functional security capabilities globally enforced across
              resource boundaries.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50/70 border-b border-premium-border text-xs uppercase font-bold tracking-wider text-zinc-700">
                  <th className="p-4 pl-6">Core Capability Route</th>
                  <th className="p-4 text-center">Owner Node</th>
                  <th className="p-4 text-center">Administrator</th>
                  <th className="p-4 text-center">Standard Member</th>
                  <th className="p-4 text-center">Guest Cluster</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                <tr>
                  <td className="p-4 pl-6 font-medium text-zinc-900">
                    Provision/Deprovision Workspaces
                  </td>
                  <td className="p-4 text-center text-emerald-600 font-bold">
                    <Check className="h-4 w-4 mx-auto text-emerald-500" />
                  </td>
                  <td className="p-4 text-center text-zinc-400">
                    <X className="h-4 w-4 mx-auto text-zinc-300" />
                  </td>
                  <td className="p-4 text-center text-zinc-400">
                    <X className="h-4 w-4 mx-auto text-zinc-300" />
                  </td>
                  <td className="p-4 text-center text-zinc-400">
                    <X className="h-4 w-4 mx-auto text-zinc-300" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-medium text-zinc-900">
                    Initialize Sprint Lifecycle Pools
                  </td>
                  <td className="p-4 text-center text-emerald-600 font-bold">
                    <Check className="h-4 w-4 mx-auto text-emerald-500" />
                  </td>
                  <td className="p-4 text-center text-emerald-600 font-bold">
                    <Check className="h-4 w-4 mx-auto text-emerald-500" />
                  </td>
                  <td className="p-4 text-center text-zinc-400">
                    <X className="h-4 w-4 mx-auto text-zinc-300" />
                  </td>
                  <td className="p-4 text-center text-zinc-400">
                    <X className="h-4 w-4 mx-auto text-zinc-300" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-medium text-zinc-900">
                    Deploy & Mutate Task Cards
                  </td>
                  <td className="p-4 text-center text-emerald-600 font-bold">
                    <Check className="h-4 w-4 mx-auto text-emerald-500" />
                  </td>
                  <td className="p-4 text-center text-emerald-600 font-bold">
                    <Check className="h-4 w-4 mx-auto text-emerald-500" />
                  </td>
                  <td className="p-4 text-center text-emerald-600 font-bold">
                    <Check className="h-4 w-4 mx-auto text-emerald-500" />
                  </td>
                  <td className="p-4 text-center text-zinc-400">
                    <X className="h-4 w-4 mx-auto text-zinc-300" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
