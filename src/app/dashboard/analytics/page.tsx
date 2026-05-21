"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowUpRight,
  Download,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<any>;
}

function MetricCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="bg-premium-card border border-premium-border rounded-xl p-5 shadow-xs hover:border-zinc-300 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-premium-textMuted uppercase tracking-wider">
          {title}
        </span>
        <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-200/60 flex items-center justify-center text-zinc-600">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-zinc-900">
          {value}
        </span>
        <span
          className={`inline-flex items-center text-xs font-bold ${isPositive ? "text-emerald-600" : "text-amber-600"}`}
        >
          {isPositive ? "↑" : "↓"} {change}
        </span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("sprint-4");

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Structural Module Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-premium-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Workspace Performance Insights
          </h1>
          <p className="text-sm text-premium-textMuted mt-1">
            Audit team velocity formulas, backlog cycle lengths, and product
            deployment rates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 rounded-lg border border-premium-border bg-white text-sm outline-none font-medium text-zinc-700 cursor-pointer"
          >
            <option value="sprint-4">Active Sprint (Alpha 04)</option>
            <option value="sprint-3">Sprint Alpha 03</option>
            <option value="month">Past 30 Calendar Days</option>
          </select>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-premium-border text-zinc-700 hover:bg-zinc-50 text-sm font-semibold rounded-lg transition-colors cursor-pointer outline-none">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Structural Metrics Block Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Velocity Throughput"
          value="48 Points"
          change="12% vs last scope"
          isPositive={true}
          icon={TrendingUp}
        />
        <MetricCard
          title="Tasks Fully Verified"
          value="34 Cards"
          change="82% completion rate"
          isPositive={true}
          icon={CheckCircle2}
        />
        <MetricCard
          title="Average Cycle Time"
          value="2.4 Days"
          change="0.6 days faster"
          isPositive={true}
          icon={Clock}
        />
        <MetricCard
          title="Active Blocks / Impediments"
          value="3 Blockers"
          change="2 added today"
          isPositive={false}
          icon={AlertTriangle}
        />
      </div>
    </div>
  );
}

{
  /* Sibling container under your layout grid architecture */
}
<div className="bg-premium-card border border-premium-border rounded-xl shadow-xs overflow-hidden mt-8">
  <div className="p-5 border-b border-premium-border bg-white flex items-center justify-between">
    <div>
      <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
        <Layers className="h-4.5 w-4.5 text-brand-primary" /> Active Resource
        Load Balancer
      </h3>
      <p className="text-xs text-premium-textMuted mt-0.5">
        Audit point allocations and feature completion rates by team member.
      </p>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse text-sm">
      <thead>
        <tr className="bg-zinc-50/70 border-b border-premium-border text-xs uppercase font-bold tracking-wider text-zinc-700">
          <th className="p-4 pl-6">Team Member Node</th>
          <th className="p-4">Assigned Allocation</th>
          <th className="p-4">Throughput Efficiency</th>
          <th className="p-4 text-right pr-6">Activity State</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-100 text-zinc-800">
        <tr className="hover:bg-zinc-50/40 transition-colors">
          <td className="p-4 pl-6 font-semibold text-zinc-900">Rayhan</td>
          <td className="p-4">18 Story Points (4 tasks)</td>
          <td className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-24 bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200/50">
                <div
                  className="bg-brand-primary h-full rounded-full"
                  style={{ width: "92%" }}
                />
              </div>
              <span className="text-xs font-bold text-zinc-700">92%</span>
            </div>
          </td>
          <td className="p-4 text-right pr-6">
            <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
              Optimal
            </span>
          </td>
        </tr>
        <tr className="hover:bg-zinc-50/40 transition-colors">
          <td className="p-4 pl-6 font-semibold text-zinc-900">Asif Rahman</td>
          <td className="p-4">14 Story Points (3 tasks)</td>
          <td className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-24 bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200/50">
                <div
                  className="bg-brand-primary h-full rounded-full"
                  style={{ width: "78%" }}
                />
              </div>
              <span className="text-xs font-bold text-zinc-700">78%</span>
            </div>
          </td>
          <td className="p-4 text-right pr-6">
            <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
              Optimal
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>;
