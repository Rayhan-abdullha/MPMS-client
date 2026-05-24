// dashboard/MobileHeader.tsx
"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";

interface Props {
  open: boolean;
  onToggle: () => void;
}

export default function MobileHeader({ open, onToggle }: Props) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-premium-card border-b border-premium-border flex items-center justify-between px-4 z-30">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 bg-brand-primary text-white rounded flex items-center justify-center font-bold text-sm">
          M
        </div>

        <a
          href="/"
          className="font-bold text-zinc-950 tracking-tight text-xs uppercase"
        >
          MPMS
        </a>
      </div>

      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-zinc-50 cursor-pointer"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  );
}
