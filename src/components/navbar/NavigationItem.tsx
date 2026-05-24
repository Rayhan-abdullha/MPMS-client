// dashboard/NavigationItem.tsx
"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { SidebarItem } from "./navigation";

interface Props {
  item: SidebarItem;
  active: boolean;
  onClick?: () => void;
}

export default function NavigationItem({ item, active, onClick }: Props) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group",
        active
          ? "bg-brand-surface text-brand-primary font-semibold"
          : "text-premium-textMuted hover:bg-zinc-50 hover:text-zinc-900",
      )}
    >
      <item.icon
        className={clsx(
          "h-4.5 w-4.5",
          active
            ? "text-brand-primary"
            : "text-zinc-400 group-hover:text-zinc-600",
        )}
      />

      {item.name}
    </Link>
  );
}
