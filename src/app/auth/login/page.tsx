"use client";

import { useForm } from "react-hook-form";
import { LogIn, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Link from "next/link";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login, errorText } = useAuth();
  const { mutate, isPending } = login;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-11 w-11 mx-auto bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
            M
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">MPMS Workspace</h1>
          <p className="text-sm text-zinc-500">Sign in to continue</p>
        </div>

        {/* Error */}
        {errorText && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {errorText}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-zinc-600 uppercase">
              Email
            </label>
            <input
              type="email"
              disabled={isPending}
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 focus:border-indigo-500 outline-none text-sm"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-zinc-600 uppercase">
              Password
            </label>
            <input
              type="password"
              disabled={isPending}
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Min 6 characters required",
                },
              })}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 focus:border-indigo-500 outline-none text-sm"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-indigo-600 font-medium cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
