"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileText,
  Gauge,
  LineChart,
  Network,
  Server,
  Settings,
  Shield,
  X,
} from "lucide-react";

export const navGroups = [
  {
    label: "Monitor",
    items: [
      { icon: Gauge, label: "Dashboard", sectionId: null as string | null },
      { icon: Cpu, label: "Processes", sectionId: "processes" },
      { icon: LineChart, label: "Metrics", sectionId: "metrics" },
      { icon: FileText, label: "Logs", sectionId: "logs" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Network, label: "Network", sectionId: "status" },
      { icon: Server, label: "Nodes", sectionId: "inventory" },
      { icon: Shield, label: "Security", sectionId: "alerts" },
      { icon: Settings, label: "Settings", sectionId: "forms" },
    ],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onNavigate?: (sectionId: string | null) => void;
  activeItem?: string;
}

export function Sidebar({ mobileOpen, onClose, collapsed, onCollapsedChange, onNavigate, activeItem = "Dashboard" }: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const first = sidebarRef.current?.querySelector<HTMLElement>(".nav-link");
    setTimeout(() => first?.focus(), 0);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        sidebarRef.current!.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) =>
          !(el as HTMLButtonElement).disabled &&
          !(el as HTMLInputElement).disabled &&
          el.offsetParent !== null
      );
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, onClose]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-900/20 transition-opacity duration-200 md:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        ref={sidebarRef}
        id="primary-sidebar"
        className={cn(
          "fixed top-0 left-0 z-40 h-[100dvh] w-64 shrink-0 flex flex-col overflow-hidden border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 transition-all duration-200 ease-out md:fixed md:top-5 md:left-5 md:h-[calc(100dvh-2.5rem)] md:translate-x-0 md:rounded-2xl rounded-r-2xl rounded-l-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed && "md:w-20"
        )}
        aria-label="Primary sidebar"
        role={mobileOpen ? "dialog" : undefined}
        aria-modal={mobileOpen ? "true" : undefined}
      >
        <div className="h-14 p-3 border-b border-white/50 bg-white/40 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-violet-500 text-white flex items-center justify-center shadow-sm shrink-0"
              aria-hidden="true"
            >
              <span className="text-xs font-bold">C</span>
            </div>
            <span
              className={cn(
                "text-xs font-bold uppercase tracking-widest text-slate-700 truncate transition-opacity",
                collapsed && "md:opacity-0 md:w-0"
              )}
            >
              Core Network
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="hidden md:flex p-1.5 rounded-md hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
              aria-pressed={collapsed}
              onClick={() => {
                onCollapsedChange(!collapsed);
                setProfileOpen(false);
              }}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              )}
            </button>
            <button
              type="button"
              className="md:hidden p-1.5 rounded-md hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              aria-label="Close navigation"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-1" aria-label="Primary navigation">
          {navGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <div
                className={cn(
                  "px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500",
                  collapsed && "md:hidden"
                )}
              >
                {group.label}
              </div>
              {group.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={cn(
                    "nav-link w-full flex items-center gap-2 px-2 py-2 text-xs font-medium rounded-lg hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98] transition-colors text-slate-600",
                    activeItem === item.label && "bg-blue-50 text-blue-700",
                    collapsed && "md:justify-center"
                  )}
                  aria-current={activeItem === item.label ? "page" : undefined}
                  onClick={() => {
                    onNavigate?.(item.sectionId);
                    onClose();
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-4 h-4 opacity-70 shrink-0" aria-hidden="true" />
                  <span className={cn("truncate", collapsed && "md:hidden")}>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-2 border-t border-white/50 bg-white/30">
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              id="profile-btn"
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors text-left"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              onClick={() => {
                if (collapsed) {
                  onCollapsedChange(false);
                  setProfileOpen(true);
                } else {
                  setProfileOpen((p) => !p);
                }
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 shadow-inner shrink-0" />
              <div className={cn("flex flex-col min-w-0", collapsed && "md:hidden")}>
                <span className="text-[10px] font-bold leading-none truncate">SYS_ADMIN</span>
                <span className="text-[9px] text-slate-500 font-mono truncate">ID: 0x4A</span>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute bottom-full left-2 right-2 mb-1 p-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg flex flex-col gap-0.5">
                <div className="px-2 py-1 text-[10px] text-slate-500">Status</div>
                <button type="button" className="text-left px-2 py-1.5 text-xs rounded-md hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-slate-700">Online</button>
                <button type="button" className="text-left px-2 py-1.5 text-xs rounded-md hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-slate-700">Away</button>
                <button type="button" className="text-left px-2 py-1.5 text-xs rounded-md hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-slate-700">Settings</button>
                <button type="button" className="text-left px-2 py-1.5 text-xs rounded-md hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-red-600">Logout</button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
