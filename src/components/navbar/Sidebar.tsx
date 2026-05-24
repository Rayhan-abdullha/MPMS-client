// dashboard/Sidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import { User as UserIcon } from "lucide-react";

import NavigationItem from "./NavigationItem";
import { navigationItems } from "./navigation";
import SignOut from "@/features/auth/components/SignOut";

interface Props {
  user?: {
    name: string;
    role: string;
  } | null;
}

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-premium-card border-r border-premium-border fixed top-0 bottom-0 left-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-premium-border gap-2.5">
        <div className="h-8 w-8 bg-brand-primary text-white rounded-md flex items-center justify-center font-bold text-base">
          M
        </div>

        <a
          href="/"
          className="font-bold text-zinc-950 tracking-tight text-sm uppercase"
        >
          MPMS
        </a>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.href}
            item={item}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-premium-border space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-9 w-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-zinc-600" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>

              <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 rounded mt-0.5">
                {user.role}
              </span>
            </div>
          </div>
        )}

        <SignOut />
      </div>
    </aside>
  );
}
