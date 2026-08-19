"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { navGroups, Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { SectionHeader } from "@/components/SectionHeader";
import {
  AlertsFeed,
  ChartsSection,
  DiskAndServices,
  FormsSection,
  HardwarePanel,
  MediaGallery,
  PipelineInventory,
  ProcessSection,
  StatusControls,
  TeamAndActivity,
} from "@/components/sections";
import type {
  Alert,
  Control,
  Disk,
  InventoryItem,
  Log,
  Metric,
  Process,
  Task,
  TeamMember,
} from "@/lib/data";

interface DashboardProps {
  metrics: Metric[];
  processes: Process[];
  thermal: { label: string; value: number; color: string }[];
  disks: Disk[];
  topServices: { name: string; pid: number; cpu: number; mem: number }[];
  team: TeamMember[];
  tasks: Task[];
  logs: Log[];
  controls: Control[];
  inventory: InventoryItem[];
  alerts: Alert[];
}

function labelForSection(id: string | null) {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.sectionId === id) return item.label;
    }
  }
  return "Dashboard";
}

export function Dashboard(props: DashboardProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    function onScroll() {
      if (!main) return;
      const header = main.querySelector("header");
      const offset = (header?.clientHeight ?? 64) + 8;
      const scrollPos = main.scrollTop + offset;
      const candidates: { label: string; top: number }[] = [];
      for (const group of navGroups) {
        for (const item of group.items) {
          const id = item.sectionId;
          if (!id) continue;
          const el = document.getElementById(id);
          if (el) candidates.push({ label: item.label, top: el.offsetTop });
        }
      }
      if (candidates.length === 0) return;
      candidates.sort((a, b) => a.top - b.top);
      if (scrollPos < candidates[0].top) {
        setActiveNav("Dashboard");
        return;
      }
      let activeLabel = candidates[0].label;
      let bestDist = Math.abs(candidates[0].top - scrollPos);
      for (let i = 1; i < candidates.length; i++) {
        const dist = Math.abs(candidates[i].top - scrollPos);
        if (dist < bestDist) {
          bestDist = dist;
          activeLabel = candidates[i].label;
        }
      }
      setActiveNav(activeLabel);
    }
    main.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToSection(id: string | null) {
    setActiveNav(labelForSection(id));
    const main = mainRef.current;
    if (!main) return;
    if (!id) {
      main.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    const header = main.querySelector("header");
    if (!el) return;
    const offset = (header?.clientHeight ?? 0);
    main.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
  }

  return (
    <>
      <a href="#main-content" className="sr-only focusable">
        Skip to dashboard content
      </a>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-indigo-50 to-fuchsia-50" aria-hidden="true" />
      <div className="flex h-dvh w-full flex-col md:flex-row p-3 md:p-5 gap-3 md:gap-4 overflow-hidden">
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          onNavigate={scrollToSection}
          activeItem={activeNav}
        />

        <main
          ref={mainRef}
          id="main-content"
          className={cn(
            "relative flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto overflow-x-hidden px-3 md:px-4 pb-3 md:pb-4 gap-3 md:gap-4",
            collapsed ? "md:ml-[calc(5rem+1.25rem)]" : "md:ml-[calc(16rem+1.25rem)]"
          )}
          tabIndex={-1}
        >
          <Header mobileOpen={mobileOpen} onMenuClick={() => setMobileOpen(true)} />

          <div className="flex flex-col min-h-0 gap-3 md:gap-4">
            <section id="metrics" className="grid grid-cols-2 md:grid-cols-4 min-[1920px]:grid-cols-6 gap-3 md:gap-4" aria-labelledby="metrics-heading">
              <SectionHeader title="Metrics" id="metrics-heading" className="col-span-full" />
              {props.metrics.map((m) => (
                <MetricCard key={m.label} metric={m} />
              ))}
            </section>

            <div id="processes" className="flex flex-col gap-3 md:gap-4 min-h-80" aria-labelledby="processes-heading">
              <SectionHeader title="Processes" id="processes-heading" />
              <div className="flex flex-col lg:flex-row gap-3 md:gap-4 min-h-0 flex-1">
                <ProcessSection processes={props.processes} />
                <HardwarePanel thermal={props.thermal} />
              </div>
            </div>

            <div id="services" aria-labelledby="services-heading">
              <SectionHeader title="Services" id="services-heading" />
              <DiskAndServices disks={props.disks} topServices={props.topServices} />
            </div>
            <div id="charts" aria-labelledby="charts-heading">
              <SectionHeader title="Charts" id="charts-heading" />
              <ChartsSection />
            </div>
            <div id="logs" aria-labelledby="logs-heading">
              <SectionHeader title="Logs & Activity" id="logs-heading" />
              <TeamAndActivity team={props.team} tasks={props.tasks} logs={props.logs} />
            </div>
            <div id="status" aria-labelledby="status-heading">
              <SectionHeader title="Network Status" id="status-heading" />
              <StatusControls controls={props.controls} />
            </div>
            <div id="inventory" aria-labelledby="inventory-heading">
              <SectionHeader title="Nodes & Inventory" id="inventory-heading" />
              <PipelineInventory inventory={props.inventory} />
            </div>
            <div id="gallery" aria-labelledby="gallery-heading">
              <SectionHeader title="Media Gallery" id="gallery-heading" />
              <MediaGallery />
            </div>
            <div id="forms" aria-labelledby="forms-heading">
              <SectionHeader title="Settings" id="forms-heading" />
              <FormsSection />
            </div>
            <div id="alerts" aria-labelledby="alerts-heading">
              <SectionHeader title="Security Alerts" id="alerts-heading" />
              <AlertsFeed alerts={props.alerts} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
