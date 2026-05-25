"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { LogOut } from "lucide-react";

function SignOut() {
  const { logout } = useAuth();
  const { mutate } = logout;

  const handleLogout = () => {
    mutate();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50/60 rounded-lg transition-colors cursor-pointer outline-none group"
    >
      <LogOut className="h-4.5 w-4.5 text-red-400 group-hover:text-red-600 transition-colors" />
      Log Out
    </button>
  );
}

export default SignOut;
