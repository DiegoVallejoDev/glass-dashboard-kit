"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, Search } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [condensed, setCondensed] = useState(false);
  const [active, setActive] = useState(false);
  const [time, setTime] = useState("--:--:--");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function tick() {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onScroll() {
      if (active) return;
      setCondensed(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  function expand() {
    setActive(true);
    setCondensed(false);
  }

  function maybeCondense() {
    setActive(false);
    setCondensed(window.scrollY > 12);
  }

  return (
    <header
      ref={headerRef}
      id="top-header"
      className={cn(
        "sticky top-0 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2 bg-white/88 border border-slate-200/60 rounded-2xl shadow-sm transition-all duration-200 z-20",
        condensed && "header-condensed"
      )}
      onMouseEnter={expand}
      onMouseLeave={maybeCondense}
      onFocus={expand}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        if (!headerRef.current?.contains(e.relatedTarget as Node)) {
          maybeCondense();
        }
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          className="md:hidden p-1.5 rounded-md hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Open navigation"
          aria-expanded={false}
          onClick={onMenuClick}
        >
          <Menu className="w-4 h-4 text-slate-600" />
        </button>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="header-dot w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/40"
              aria-hidden="true"
            />
            <h1 className="text-sm font-semibold text-slate-800 truncate">Extended System Telemetry</h1>
          </div>
          <nav aria-label="Breadcrumb" className="header-breadcrumb mt-0.5 min-w-0">
            <ol className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
              <li>Cluster Alpha</li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-slate-700">Node Array 01</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="header-search relative flex-1 sm:flex-none min-w-0">
          <label htmlFor="search" className="sr-only">
            Search resources
          </label>
          <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            id="search"
            type="search"
            placeholder="Query resources..."
            className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-xs bg-white/70 border border-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white placeholder-slate-400 transition-all"
          />
        </div>
        <div className="header-extra hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
          <span className="header-tagline flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            Live
          </span>
          <span id="clock" className="font-mono tabular-nums">
            {time}
          </span>
        </div>
      </div>
    </header>
  );
}
