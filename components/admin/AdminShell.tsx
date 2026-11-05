"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Images,
  ClipboardList,
  Users,
  BarChart2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ToastProvider } from "@/components/admin/Toast";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/kegiatan", label: "Kegiatan", icon: Calendar },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/form-pendaftaran", label: "Form Pendaftaran", icon: ClipboardList },
  { href: "/admin/pendaftar", label: "Pendaftar", icon: Users },
  { href: "/admin/plotting", label: "Plotting", icon: BarChart2 },
];

interface AdminShellProps {
  children: React.ReactNode;
  contentClassName?: string;
}

export default function AdminShell({
  children,
  contentClassName = "md:pl-10",
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render children directly with no admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  const navLinks = (
    <nav className="flex flex-1 flex-col space-y-1 px-2 py-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex h-11 items-center gap-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors ${
              isActive
                ? "border-l-4 border-accent bg-white/10 text-white"
                : "border-l-4 border-transparent text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={18} className="shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface">
        {/* Mobile Top Bar */}
        <header className="flex h-14 items-center justify-between border-b border-white/10 bg-primary-deep px-4 md:hidden">
          <div className="flex items-center gap-2.5">
            <div
              className="flex size-7 items-center justify-center rounded-md bg-accent text-ink"
              aria-hidden="true"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <span className="font-display text-lg tracking-wide text-white">
              PASTEER3 ADMIN
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            className="grid size-10 place-items-center rounded-md text-white/80 hover:text-white"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {/* Mobile slide-over drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="flex h-full w-[260px] flex-col bg-primary-deep text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
                <span className="font-display text-lg tracking-wide text-white">
                  PASTEER3
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {navLinks}

              <div className="border-t border-white/10 p-3">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex h-11 w-full items-center gap-3 rounded-md px-4 text-xs font-semibold uppercase tracking-wider text-white/80 transition-colors hover:bg-danger/20 hover:text-white"
                >
                  <LogOut size={18} />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Fixed Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col border-r border-white/10 bg-primary-deep text-white md:flex">
          <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-ink"
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <span className="font-display text-xl tracking-wide text-white">
              PASTEER3
            </span>
          </div>

          {navLinks}

          <div className="border-t border-white/10 p-4">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex h-11 w-full items-center gap-3 rounded-md px-4 text-xs font-semibold uppercase tracking-wider text-white/70 transition-colors hover:bg-danger/20 hover:text-white"
            >
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className={`min-h-screen bg-surface p-4 md:ml-[240px] md:p-8 ${contentClassName}`}
        >
          <Suspense fallback={<div className="p-8 text-sm text-muted">Memuat...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </ToastProvider>
  );
}
