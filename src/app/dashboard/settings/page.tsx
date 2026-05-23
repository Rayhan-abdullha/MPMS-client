"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Building,
  Shield,
  Bell,
  Save,
  Loader2,
  CheckCircle2,
  Globe,
  Terminal,
} from "lucide-react";
import { clsx } from "clsx";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  companyName: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "workspace" | "security"
  >("profile");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Rayhan",
    email: "developer@rayhanfoods.com",
    role: "ADMIN",
    companyName: "Rayhan Foods",
    timezone: "Asia/Dhaka (GMT+6)",
    emailNotifications: true,
    pushNotifications: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("mpms_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setProfile((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          role: parsed.role || prev.role,
        }));
      } catch (e) {}
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const tabs = [
    { id: "profile", name: "User Profile", icon: User },
    { id: "workspace", name: "Workspace Nodes", icon: Building },
    { id: "security", name: "Security & Access", icon: Shield },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Structural Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-premium-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            System Preferences
          </h1>
          <p className="text-sm text-premium-textMuted mt-1">
            Configure user identity nodes, application rules, and ledger
            permissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar Matrix */}
        <nav className="lg:col-span-3 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 border-b lg:border-b-0 border-premium-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap outline-none cursor-pointer",
                  isSelected
                    ? "bg-brand-surface text-brand-primary font-bold shadow-xs"
                    : "text-premium-textMuted hover:text-zinc-900 hover:bg-zinc-50",
                )}
              >
                <Icon
                  className={clsx(
                    "h-4.5 w-4.5",
                    isSelected ? "text-brand-primary" : "text-zinc-400",
                  )}
                />
                {tab.name}
              </button>
            );
          })}
        </nav>

        {/* Configurations Ingestion Canvas Form */}
        <div className="lg:col-span-9 bg-premium-card border border-premium-border rounded-xl shadow-xs">
          <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
            {/* TAB SECTION: PROFILE ENGINE */}
            {activeTab === "profile" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-zinc-100 pb-4">
                  <h3 className="text-base font-bold text-zinc-900">
                    User Profile Nodes
                  </h3>
                  <p className="text-xs text-premium-textMuted mt-0.5">
                    Manage your public operational data and global routing
                    tokens.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Identity Alias
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg border border-premium-border text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all bg-white text-zinc-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Account Access Authority
                    </label>
                    <div className="w-full px-3.5 py-2 rounded-lg border border-premium-border bg-zinc-50 text-zinc-500 text-sm font-mono flex items-center gap-2 select-none">
                      <Terminal className="h-3.5 w-3.5 text-zinc-400" />
                      {profile.role} NODE
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Communication Gateway Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-premium-border text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all bg-white text-zinc-900"
                  />
                </div>
              </div>
            )}

            {/* TAB SECTION: WORKSPACE LOGIC */}
            {activeTab === "workspace" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-zinc-100 pb-4">
                  <h3 className="text-base font-bold text-zinc-900">
                    Workspace Configurations
                  </h3>
                  <p className="text-xs text-premium-textMuted mt-0.5">
                    Configure variables regarding team coordination engines.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Enterprise Brand Entity
                  </label>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) =>
                      setProfile({ ...profile, companyName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-premium-border text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all bg-white text-zinc-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Chronology Timezone Cluster
                  </label>
                  <div className="relative">
                    <select
                      value={profile.timezone}
                      onChange={(e) =>
                        setProfile({ ...profile, timezone: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg border border-premium-border bg-white text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all appearance-none text-zinc-900 cursor-pointer"
                    >
                      <option value="Asia/Dhaka (GMT+6)">
                        Asia/Dhaka (GMT+6)
                      </option>
                      <option value="Asia/Kolkata (GMT+5:30)">
                        Asia/Kolkata (GMT+5:30)
                      </option>
                      <option value="UTC (GMT+0)">
                        Coordinated Universal Time (UTC)
                      </option>
                    </select>
                    <Globe className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB SECTION: SECURITY LOGIC */}
            {activeTab === "security" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-zinc-100 pb-4">
                  <h3 className="text-base font-bold text-zinc-900">
                    Security & Ledger Integrity
                  </h3>
                  <p className="text-xs text-premium-textMuted mt-0.5">
                    Audit credential states and adjust verification gates.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-lg border border-premium-border bg-zinc-50/60">
                    <div className="space-y-0.5 pr-4">
                      <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                        Two-Factor Encryption (2FA)
                      </h4>
                      <p className="text-xs text-premium-textMuted">
                        Enforce secure tokens on every entry handshake sequence.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded">
                      INACTIVE
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-lg border border-premium-border bg-zinc-50/60">
                    <div className="space-y-0.5 pr-4">
                      <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                        Session Key Access Lifecycle
                      </h4>
                      <p className="text-xs text-premium-textMuted">
                        Automatically rotate validation tokens every 7 calendar
                        days.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded">
                      ENFORCED
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Global Actions Bar Segment */}
            <div className="border-t border-zinc-100 pt-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> State
                    updates saved successfully!
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-hover disabled:bg-zinc-300 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:cursor-not-allowed"
              >
                {false ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save System State
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
