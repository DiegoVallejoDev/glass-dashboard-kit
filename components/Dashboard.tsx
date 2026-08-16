"use client";

import { useState } from "react";
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

  return (
    <>
      <a href="#main-content" className="sr-only focusable">
        Skip to dashboard content
      </a>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-indigo-50 to-fuchsia-50" aria-hidden="true" />
      <div className="flex min-h-[100dvh] w-full flex-col md:flex-row p-3 md:p-5 gap-3 md:gap-4">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <main id="main-content" className="flex-1 flex flex-col min-h-0 gap-3 md:gap-4" tabIndex={-1}>
          <Header onMenuClick={() => setMobileOpen(true)} />

          <section className="grid grid-cols-2 md:grid-cols-4 min-[1920px]:grid-cols-6 gap-3 md:gap-4" aria-label="Key metrics">
            {props.metrics.map((m) => (
              <MetricCard key={m.label} metric={m} />
            ))}
          </section>

          <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 md:gap-4">
            <ProcessSection processes={props.processes} />
            <HardwarePanel thermal={props.thermal} />
          </div>

          <DiskAndServices disks={props.disks} topServices={props.topServices} />
          <ChartsSection />
          <TeamAndActivity team={props.team} tasks={props.tasks} logs={props.logs} />
          <StatusControls controls={props.controls} />
          <PipelineInventory inventory={props.inventory} />
          <MediaGallery />
          <FormsSection />
          <AlertsFeed alerts={props.alerts} />
        </main>
      </div>
    </>
  );
}
