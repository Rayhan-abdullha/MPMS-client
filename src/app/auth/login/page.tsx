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
  const { loginMutation, errorText } = useAuth();
  const { mutate: login, isPending } = loginMutation;

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <div className="h-10 w-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm mx-auto">
            M
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            MPMS - Workspace
          </h1>
          <p className="text-xs text-zinc-500">Sign in to your account</p>
        </div>

        {/* API Error Feedback Banner */}
        {errorText && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs font-medium text-red-600 animate-in fade-in zoom-in-95">
            {errorText}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              disabled={isPending}
              placeholder="evaluator@datapollex.com"
              {...registerField("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-[11px] font-medium text-red-500 pl-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              disabled={isPending}
              placeholder="••••••••"
              {...registerField("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-500"
            />
            {errors.password && (
              <p className="text-[11px] font-medium text-red-500 pl-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" /> Sign In
              </>
            )}
          </button>
        </form>
        {/* add a signup link */}
        <p className="text-xs text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-indigo-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
