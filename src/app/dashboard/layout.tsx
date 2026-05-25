// DashboardLayout.tsx
"use client";

import MobileHeader from "@/components/navbar/MobileHeader";
import MobileSidebar from "@/components/navbar/MobileSidebar";
import Sidebar from "@/components/navbar/Sidebar";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <MobileHeader
        open={mobileOpen}
        onToggle={() => setMobileOpen((prev) => !prev)}
      />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
          <Toaster />
        </div>
      </main>
    </div>
  );
}
