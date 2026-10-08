"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  LayoutDashboard, ScanSearch, History, Info, Settings, ShieldCheck, Search, Bell, Sun, Menu, X,
} from "lucide-react";
import { SIDEBAR_ITEMS, cn } from "@/lib/client";

const ICONS = { LayoutDashboard, ScanSearch, History, Info, Settings } as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="mt-2 flex-1 space-y-1 px-3">
      {SIDEBAR_ITEMS.map((item) => {
        const Icon = ICONS[item.icon as keyof typeof ICONS];
        const active = item.href === "/dashboard" ? pathname === item.href : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-black/[0.05] text-ink-100" : "text-ink-500 hover:bg-black/[0.02] hover:text-ink-300"
            )}
          >
            {active && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-signal" />}
            <Icon size={17} className={active ? "text-signal" : ""} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-6 py-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal/15">
        <ShieldCheck size={18} className="text-signal" />
      </div>
      <div>
        <p className="font-display text-sm font-semibold leading-none text-ink-100">MisinfoGuard</p>
        <p className="mt-1 text-[11px] leading-none text-ink-700">Risk Analyzer</p>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-base-950">
      <div className="pointer-events-none fixed inset-0 bg-aurora-1" />
      <div className="pointer-events-none fixed inset-0 bg-aurora-2" />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-black/[0.06] bg-base-900/80 backdrop-blur-xl lg:flex">
        <Brand />
        <NavLinks />
        <div className="mx-3 mb-5 rounded-2xl border border-black/[0.06] bg-gradient-to-br from-violet-500/10 to-signal/5 p-4">
          <p className="text-xs font-semibold text-ink-100">MisinfoGuard</p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-500">
            Rule-based explainable AI engine for WhatsApp message risk detection.
          </p>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-base-900 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-5 rounded-lg p-1.5 hover:bg-black/[0.05]"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
              <Brand />
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="relative lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-black/[0.06] bg-base-950/70 px-4 backdrop-blur-xl lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-ink-500 hover:bg-black/[0.04] lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-700" />
            <input
              type="text"
              placeholder="Search analyses, keywords..."
              className="w-full rounded-xl border border-black/[0.07] bg-black/[0.02] py-2 pl-9 pr-3 text-sm text-ink-100 placeholder:text-ink-700 outline-none transition-colors focus:border-signal/40 focus:bg-black/[0.04]"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => toast("No new notifications", { description: "You're all caught up." })}
              className="relative rounded-lg p-2 text-ink-500 transition-colors hover:bg-black/[0.04] hover:text-ink-100"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-signal" />
            </button>
            <button
              onClick={() => toast.info("This build ships a light-first premium theme. Dark mode is on the roadmap.")}
              className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-black/[0.04] hover:text-ink-100"
              aria-label="Toggle theme"
            >
              <Sun size={17} />
            </button>
            <div className="ml-1 flex items-center gap-2 rounded-xl border border-black/[0.07] bg-black/[0.02] py-1.5 pl-1.5 pr-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-signal text-[11px] font-bold text-white">
                MG
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-medium leading-none text-ink-100">MisinfoGuard</p>
                <p className="mt-0.5 text-[10px] leading-none text-ink-700">Guest session</p>
              </div>
            </div>
          </div>
        </header>

        <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
