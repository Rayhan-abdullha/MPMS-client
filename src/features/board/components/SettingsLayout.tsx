"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Shield,
  Moon,
  Sun,
  Clock,
  Globe,
  Key,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { clsx } from "clsx";

interface SystemPreferences {
  themeMode: "light" | "dark" | "system";
  timezoneNode: string;
  sessionTimeoutDays: number;
  allowPublicSignups: boolean;
  enforceMfa: boolean;
}

export default function SettingsLayout() {
  const [successVisible, setSuccessVisible] = useState(false);
  const [config, setConfig] = useState<SystemPreferences>({
    themeMode: "light",
    timezoneNode: "Asia/Dhaka",
    sessionTimeoutDays: 7,
    allowPublicSignups: false,
    enforceMfa: true,
  });

  const saveConfigMutation = useMutation({
    mutationFn: async (updatedConfig: SystemPreferences) => {
      await new Promise((resolve) => setTimeout(resolve, 600)); // Latency buffer simulation
      return updatedConfig;
    },
    onSuccess: () => {
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 2500);
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfigMutation.mutate(config);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Governance & Interface Nodes
        </h1>
        <p className="text-sm text-premium-textMuted mt-1">
          Regulate authorization flags, localize cluster timing coordinates, and
          modify appearance paradigms.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* SECTION: VISUAL APPEARANCE COMPLEX */}
        <div className="bg-premium-card border border-premium-border rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Sun className="h-4.5 w-4.5 text-brand-primary" />
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Appearance Paradigm
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["light", "dark", "system"] as const).map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => setConfig({ ...config, themeMode: mode })}
                className={clsx(
                  "p-4 border rounded-xl flex flex-col items-center gap-2 text-sm font-semibold transition-all cursor-pointer capitalize outline-none",
                  config.themeMode === mode
                    ? "border-brand-primary bg-brand-surface text-brand-primary shadow-xs"
                    : "border-premium-border bg-white text-zinc-600 hover:text-zinc-900 hover:border-zinc-300",
                )}
              >
                {mode === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                {mode} Mode
              </button>
            ))}
          </div>
        </div>

        {/* SECTION: CHRONOLOGY & LOCATION FIELDS */}
        <div className="bg-premium-card border border-premium-border rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Clock className="h-4.5 w-4.5 text-brand-primary" />
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Timezone Localization
            </h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Active Coordinate Group
            </label>
            <div className="relative">
              <select
                value={config.timezoneNode}
                onChange={(e) =>
                  setConfig({ ...config, timezoneNode: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-premium-border bg-white text-sm outline-none text-zinc-900 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all appearance-none cursor-pointer"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6:00)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                <option value="UTC">
                  Coordinated Universal Time (UTC+0:00)
                </option>
              </select>
              <Globe className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* SECTION: DATA ACCESS CONTROLS */}
        <div className="bg-premium-card border border-premium-border rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Shield className="h-4.5 w-4.5 text-brand-primary" />
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Access Control Policies
            </h3>
          </div>

          <div className="space-y-4">
            {/* MFA Enforcer Input Row */}
            <div className="flex items-center justify-between p-3.5 border border-premium-border rounded-xl bg-zinc-50/50">
              <div className="space-y-0.5 pr-4">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                  Multi-Factor Authentication (MFA)
                </label>
                <span className="text-xs text-premium-textMuted">
                  Enforce strict hardware or authenticator tokens on all entry
                  requests.
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.enforceMfa}
                onChange={(e) =>
                  setConfig({ ...config, enforceMfa: e.target.checked })
                }
                className="h-4 w-4 text-brand-primary border-premium-border rounded-sm focus:ring-brand-primary cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Token Rotation Session Timeline slider */}
            <div className="p-3.5 border border-premium-border rounded-xl bg-zinc-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5 pr-4">
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                    Session Token TTL Lifecycle
                  </label>
                  <span className="text-xs text-premium-textMuted">
                    Configure the total lifespan before access keys undergo
                    rotation.
                  </span>
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 bg-zinc-200 text-zinc-700 rounded-md shrink-0">
                  {config.sessionTimeoutDays} Days
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={config.sessionTimeoutDays}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    sessionTimeoutDays: Number(e.target.value),
                  })
                }
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Action Panel Footer Segment */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            {successVisible && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold animate-in fade-in slide-in-from-left-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> Security
                parameters deployed successfully!
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saveConfigMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer outline-none disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {saveConfigMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Governance State
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
