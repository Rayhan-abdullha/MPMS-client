"use client";

import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type = "text", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={twMerge(
            clsx(
              "w-full px-3.5 py-2.5 rounded-lg border bg-white text-zinc-900 text-sm transition-all duration-200 outline-none",
              error
                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-zinc-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600",
              "placeholder:text-zinc-400 shadow-sm shadow-zinc-100/50",
            ),
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-red-500 transition-all animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
