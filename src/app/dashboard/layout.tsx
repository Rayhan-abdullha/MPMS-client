"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import SignOut from "@/components/share/SignOut";
import {
  FolderGit2,
  Layers,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import { clsx } from "clsx";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: SidebarItem[] = [
  { name: "Projects", href: "/dashboard/projects", icon: FolderGit2 },
  { name: "Sprints & Board", href: "/dashboard/board", icon: Layers },
  { name: "My Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Team Members", href: "/dashboard/team", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-background flex">
      {/* --- DESKTOP SIDEBAR VIEW CONTAINER --- */}
      <aside className="hidden md:flex flex-col w-64 bg-premium-card border-r border-premium-border fixed top-0 bottom-0 left-0 z-20">
        {/* Core Product Branding Node */}
        <div className="h-16 flex items-center px-6 border-b border-premium-border gap-2.5">
          <div className="h-8 w-8 bg-brand-primary text-white rounded-md flex items-center justify-center font-bold text-base shadow-sm">
            M
          </div>
          <span className="font-bold text-zinc-950 tracking-tight text-sm uppercase">
            Performance Engine
          </span>
        </div>

        {/* Primary Interactive Route Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group",
                  isActive
                    ? "bg-brand-surface text-brand-primary font-semibold"
                    : "text-premium-textMuted hover:bg-zinc-50 hover:text-zinc-900",
                )}
              >
                <item.icon
                  className={clsx(
                    "h-4.5 w-4.5 transition-colors",
                    isActive
                      ? "text-brand-primary"
                      : "text-zinc-400 group-hover:text-zinc-600",
                  )}
                />
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* User Identity Display Widget & System Termination Portal */}
        <div className="p-4 border-t border-premium-border space-y-3">
          {user && (
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="h-9 w-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 shadow-inner">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">
                  {user.name}
                </p>
                <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 rounded mt-0.5">
                  {user.role}
                </span>
              </div>
            </div>
          )}
          <SignOut />
        </div>
      </aside>

      {/* --- MOBILE FLUID LAYOUT OVERRIDES --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-premium-card border-b border-premium-border flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 bg-brand-primary text-white rounded flex items-center justify-center font-bold text-sm">
            M
          </div>
          <span className="font-bold text-zinc-950 tracking-tight text-xs uppercase">
            MPMS
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-zinc-600 hover:bg-zinc-50 rounded-lg outline-none cursor-pointer"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Slide-out Mobile Sidebar Panel overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-zinc-900/20 backdrop-blur-xs z-20 transition-all">
          <div className="w-72 bg-premium-card h-full border-r border-premium-border flex flex-col p-4 animate-in slide-in-from-left duration-200">
            <nav className="flex-1 space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-surface text-brand-primary font-semibold"
                        : "text-premium-textMuted hover:bg-zinc-50",
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                    {item.name}
                  </a>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-premium-border space-y-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                <SignOut />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT INJECTION CANVAS PANELS --- */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
