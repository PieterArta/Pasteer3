"use client";

import { useState } from "react";
import { ArrowUpRight, Lock, Mail } from "lucide-react";
import { loginAdmin } from "@/lib/actions/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        return;
      }
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat masuk."
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-deep p-4">
      {/* Centered card: 400px wide on desktop, 8px radius, 1px border */}
      <div className="w-full max-w-[400px] rounded-[8px] border border-white/15 bg-white p-6 shadow-2xl md:p-8">
        {/* Brand header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-xl bg-accent text-ink shadow-sm"
            aria-hidden="true"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
          <span className="font-display text-2xl tracking-wide text-ink">
            PASTEER3
          </span>
          <p className="mt-1 text-xs text-muted">Panel Masuk Administrator</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pasteer3.org"
                className="h-12 w-full rounded-[4px] border border-line px-3.5 pl-10 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 w-full rounded-[4px] border border-line px-3.5 pl-10 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex h-12 w-full items-center justify-between rounded-[4px] bg-ink px-4 text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-95 disabled:opacity-50"
          >
            <span>{loading ? "Memproses..." : "Masuk"}</span>
            <span
              className="flex size-7 items-center justify-center rounded-[2px] bg-accent text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            >
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </span>
          </button>

          {error && (
            <div
              role="alert"
              className="rounded-[4px] bg-danger/10 p-2.5 text-center text-xs font-medium text-danger"
            >
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
