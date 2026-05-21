"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/Input";
import { ShieldCheck, UserPlus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/utils/api";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  role: "MEMBER" | "MANAGER" | "ADMIN";
}

export default function RegisterPage() {
  const { register, isLoggingIn, errorText } = useAuth();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "MEMBER",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    register({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
    });
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

        {/* API Error Feedback */}
        {errorText && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 text-xs font-medium text-red-600 animate-in fade-in zoom-in-95">
            {errorText}
          </div>
        )}

        {/* Validation Errors Summary (Optional, but helpful for UX) */}
        {Object.keys(errors).length > 0 && !errorText && (
          <div className="mb-5 p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs font-medium text-amber-700 animate-in fade-in zoom-in-95">
            Please fill out all required fields correctly.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Input
              label="Full Name"
              placeholder="John Doe"
              {...registerField("name", { required: "Full name is required" })}
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-red-500 pl-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              label="Work Email"
              type="email"
              placeholder="name@company.com"
              {...registerField("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-[11px] font-medium text-red-500 pl-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              {...registerField("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-[11px] font-medium text-red-500 pl-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-premium-textMuted">
              Workspace Core Account Role
            </label>
            <select
              {...registerField("role")}
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
            disabled={isLoggingIn}
            className="w-full mt-2 py-2.5 px-4 bg-brand-primary hover:bg-brand-hover disabled:bg-zinc-300 text-white font-medium text-sm rounded-lg shadow-sm transition-colors duration-150 flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
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
