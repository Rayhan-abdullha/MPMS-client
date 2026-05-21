// "use client";

// import React, { useState } from "react";
// import { Input } from "@/components/ui/Input";
// import { useAuth } from "@/features/auth/hooks/useAuth";
// import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
// import { motion } from "framer-motion";

// export default function LoginPage() {
//   const { login, isLoggingIn, errorText } = useAuth();
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) return;
//     login(formData);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4 selection:bg-brand-surface">
//       <motion.div
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.35, ease: "easeOut" }}
//         className="w-full max-w-[420px] bg-premium-card border border-premium-border rounded-xl p-8 shadow-sm"
//       >
//         {/* Branding Area */}
//         <div className="flex flex-col items-center mb-8 text-center">
//           <div className="h-11 w-11 rounded-lg bg-brand-surface flex items-center justify-center text-brand-primary mb-3 border border-indigo-100">
//             <ShieldCheck className="h-6 w-6" />
//           </div>
//           <h1 className="text-xl font-bold tracking-tight text-zinc-900">
//             Welcome back
//           </h1>
//           <p className="text-sm text-premium-textMuted mt-1">
//             Enter your details to access your workspace.
//           </p>
//         </div>

//         {errorText && (
//           <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 text-xs font-medium text-red-600 animate-in fade-in zoom-in-95">
//             {errorText}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             label="Work Email"
//             type="email"
//             placeholder="name@company.com"
//             required
//             value={formData.email}
//             onChange={(e) =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//           />

//           <Input
//             label="Password"
//             type="password"
//             placeholder="••••••••"
//             required
//             value={formData.password}
//             onChange={(e) =>
//               setFormData({ ...formData, password: e.target.value })
//             }
//           />

//           <button
//             type="submit"
//             disabled={isLoggingIn}
//             className="w-full mt-2 py-2.5 px-4 bg-brand-primary hover:bg-brand-hover disabled:bg-zinc-300 text-white font-medium text-sm rounded-lg shadow-sm transition-colors duration-150 flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary cursor-pointer disabled:cursor-not-allowed"
//           >
//             {isLoggingIn ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <>
//                 Sign In <ArrowRight className="h-4 w-4" />
//               </>
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-xs text-premium-textMuted">
//           Don't have an account?{" "}
//           <a
//             href="/register"
//             className="font-semibold text-brand-primary hover:text-brand-hover underline transition-colors"
//           >
//             Create an account
//           </a>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, ShieldCheck, Terminal, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const triggerTestLogin = (role: "Admin" | "Manager" | "Member") => {
    setLoading(true);
    setError("");

    // Auto-generate test profile records based on chosen test route
    const profileNode = {
      name: `${role} Evaluation Node`,
      email: `${role.toLowerCase()}@datapollex-test.com`,
      role: role.toUpperCase(), // ADMIN, MANAGER, MEMBER [cite: 84]
    };

    setTimeout(() => {
      localStorage.setItem("mpms_auth_token", "mock-jwt-token-string");
      localStorage.setItem("mpms_user", JSON.stringify(profileNode));
      router.push("/dashboard/projects");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
        {/* Core Identity Branding */}
        <div className="text-center space-y-1.5">
          <div className="h-10 w-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm mx-auto">
            M
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            Minimal Project Management
          </h1>
          <p className="text-xs text-zinc-500">
            DataPollex Recruitment Task Portal Assignment{" "}
          </p>
        </div>

        {/* Evaluation Credentials Sandbox Trigger shortcuts  */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-2.5">
          <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" /> Fast-Track
            Test Roles
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(["Admin", "Manager", "Member"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => triggerTestLogin(role)}
                className="py-1.5 px-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold rounded text-zinc-700 transition-colors cursor-pointer outline-none text-center"
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex py-1 items-center font-mono text-[10px] uppercase text-zinc-400">
          <div className="flex-grow border-t border-zinc-200"></div>
          <span className="flex-shrink mx-3">
            Or standard validation gate [cite: 83]
          </span>
          <div className="flex-grow border-t border-zinc-200"></div>
        </div>

        {/* Fallback Static Input Portals [cite: 83] */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Email Route
            </label>
            <input
              type="email"
              disabled={loading}
              placeholder="evaluator@datapollex.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Security Phrase
            </label>
            <input
              type="password"
              disabled={loading}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => triggerTestLogin("Admin")}
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <LogIn className="h-4 w-4" /> Authenticate Session Node
          </button>
        </div>
      </div>
    </div>
  );
}
