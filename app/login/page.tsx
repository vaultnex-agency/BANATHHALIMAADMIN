"use client";

import { useState } from "react";
import { Store, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginAction(email, password);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "digest" in err &&
        typeof (err as { digest?: string }).digest === "string" &&
        (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        window.location.href = "/dashboard";
        return;
      }
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF9F6] text-neutral-900">
      <div className="w-full max-w-md bg-white border border-neutral-200/80 rounded-3xl p-8 shadow-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3.5 bg-amber-50 border border-amber-200/60 rounded-2xl mb-2 text-amber-600">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900">
            Banat Halima
          </h1>
          <p className="text-xs text-neutral-500 font-sans tracking-wide uppercase font-medium">
            Admin Panel Sign In
          </p>
        </div>

        {/* Demo Credentials Helper */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-900 font-semibold">
            <span>🔑 Quick Demo Login:</span>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@banathaleema.com");
                setPassword("admin123");
              }}
              className="text-[11px] bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer shadow-2xs"
            >
              Fill Credentials
            </button>
          </div>
          <div className="text-xs text-neutral-700 space-y-0.5 font-mono">
            <div><span className="text-neutral-400">Email:</span> admin@banathaleema.com</div>
            <div><span className="text-neutral-400">Password:</span> admin123</div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl pl-10 pr-4 py-3 text-neutral-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                placeholder="admin@banathaleema.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl pl-10 pr-4 py-3 text-neutral-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-medium py-3 rounded-xl flex items-center justify-center space-x-2 transition-all text-sm disabled:opacity-50 mt-6 shadow-xs"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
