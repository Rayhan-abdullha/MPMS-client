// dashboard/MobileSidebar.tsx
"use client";

import { usePathname } from "next/navigation";

import NavigationItem from "./NavigationItem";
import { navigationItems } from "./navigation";
import SignOut from "@/features/auth/components/SignOut";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 top-16 bg-zinc-900/20 backdrop-blur-xs z-20">
      <div className="w-72 bg-premium-card h-full border-r border-premium-border flex flex-col p-4 animate-in slide-in-from-left duration-200">
        <nav className="flex-1 space-y-1">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              active={pathname === item.href}
              onClick={onClose}
            />
          ))}
        </nav>

        <div className="pt-4 border-t border-premium-border">
          <SignOut />
        </div>
      </div>
    </div>
  );
}
