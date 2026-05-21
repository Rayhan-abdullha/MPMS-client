"use client";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          404 - Page Not Found
        </h1>
        <p className="text-sm text-zinc-500">
          The page you are looking for does not exist.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}
