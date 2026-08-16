"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
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

export function Dashboard(props: DashboardProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  function scrollToSection(id: string | null) {
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
        />

        <main
          ref={mainRef}
          id="main-content"
          className={cn(
            "flex-1 flex flex-col min-h-0 gap-3 md:gap-4 overflow-y-auto",
            collapsed ? "md:ml-[calc(5rem+2.25rem)]" : "md:ml-[calc(16rem+2.25rem)]"
          )}
          tabIndex={-1}
        >
          <Header onMenuClick={() => setMobileOpen(true)} />

          <section id="metrics" className="grid grid-cols-2 md:grid-cols-4 min-[1920px]:grid-cols-6 gap-3 md:gap-4" aria-label="Key metrics">
            {props.metrics.map((m) => (
              <MetricCard key={m.label} metric={m} />
            ))}
          </section>

          <div id="processes" className="flex flex-col lg:flex-row gap-3 md:gap-4 min-h-80">
            <ProcessSection processes={props.processes} />
            <HardwarePanel thermal={props.thermal} />
          </div>

          <div id="services"><DiskAndServices disks={props.disks} topServices={props.topServices} /></div>
          <div id="charts"><ChartsSection /></div>
          <div id="logs"><TeamAndActivity team={props.team} tasks={props.tasks} logs={props.logs} /></div>
          <div id="status"><StatusControls controls={props.controls} /></div>
          <div id="inventory"><PipelineInventory inventory={props.inventory} /></div>
          <div id="gallery"><MediaGallery /></div>
          <div id="forms"><FormsSection /></div>
          <div id="alerts"><AlertsFeed alerts={props.alerts} /></div>
        </main>
      </div>
    </>
  );
}
