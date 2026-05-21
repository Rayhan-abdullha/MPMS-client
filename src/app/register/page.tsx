"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ShieldCheck, UserPlus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { register, isRegistering, errorText } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;
    register(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 selection:bg-brand-surface">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[440px] bg-premium-card border border-premium-border rounded-xl p-8 shadow-sm"
      >
        {/* Branding Area */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="h-11 w-11 rounded-lg bg-brand-surface flex items-center justify-center text-brand-primary mb-3 border border-indigo-100">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            Get started today
          </h1>
          <p className="text-sm text-premium-textMuted mt-1">
            Create your production engineering workspace node.
          </p>
        </div>

        {errorText && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 text-xs font-medium text-red-600 animate-in fade-in zoom-in-95">
            {errorText}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Work Email"
            type="email"
            placeholder="name@company.com"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-premium-textMuted">
              Workspace Core Account Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-lg border border-premium-border bg-white text-zinc-900 text-sm transition-all duration-200 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-sm shadow-zinc-100/50 cursor-pointer"
            >
              <option value="MEMBER">Team Member (Work Tracking Only)</option>
              <option value="MANAGER">
                Project Manager (Sprints & Administration)
              </option>
              <option value="ADMIN">
                System Administrator (Full Infrastructure Access)
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full mt-2 py-2.5 px-4 bg-brand-primary hover:bg-brand-hover disabled:bg-zinc-300 text-white font-medium text-sm rounded-lg shadow-sm transition-colors duration-150 flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary cursor-pointer disabled:cursor-not-allowed"
          >
            {isRegistering ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Create Account <UserPlus className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-premium-textMuted">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-brand-primary hover:text-brand-hover underline transition-colors"
          >
            Sign in instead
          </a>
        </div>
      </motion.div>
    </div>
  );
}
