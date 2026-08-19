"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { noise } from "@/lib/noise";
import type {
  Alert,
  Control,
  Disk,
  InventoryItem,
  Log,
  Process,
  Task,
  TeamMember,
} from "@/lib/data";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  ChevronRight,
  Circle,
  Clock,
  Cloud,
  Database,
  FileText,
  Info,
  Loader2,
  Lock,
  MemoryStick,
  Moon,
  Network,
  Server,
  Zap,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Metric cards (already separate component, kept here for reference)        */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Process section                                                            */
/* -------------------------------------------------------------------------- */

interface ProcessSectionProps {
  processes: Process[];
}

type SortKey = keyof Process;

export function ProcessSection({ processes }: ProcessSectionProps) {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "pid",
    dir: "asc",
  });

  const sorted = useMemo(() => {
    const list = [...processes];
    list.sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sort.dir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sort.dir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return list;
  }, [processes, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));
  }

  function statusIcon(status: Process["status"]) {
    if (status === "Running")
      return <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />;
    if (status === "Warning")
      return <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />;
    return <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />;
  }

  return (
    <section
      className="flex-1 min-h-0 flex flex-col glass-card overflow-hidden"
      aria-labelledby="active-processes-heading"
    >
      <div className="px-3 py-2 border-b border-white/50 bg-white/40 flex justify-between items-center">
        <h2 id="active-processes-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Active Processes
        </h2>
        <span className="text-[10px] font-mono bg-white/50 px-1.5 py-0.5 rounded text-slate-500">
          n={processes.length}
        </span>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <table className="w-full text-left border-collapse responsive-table">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-white/30 sticky top-0 backdrop-blur-md">
              {(["pid", "command", "cpu", "mem", "status"] as SortKey[]).map((k) => (
                <th
                  key={k}
                  className="px-3 py-2 font-semibold"
                  aria-sort={sort.key === k ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 -ml-1"
                    onClick={() => toggleSort(k)}
                  >
                    {k}
                    {sort.key === k && <ChevronRight className={cn("w-3 h-3 transition-transform", sort.dir === "desc" && "rotate-90")} aria-hidden="true" />}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs">
            {sorted.map((p) => (
              <tr key={p.pid} className="border-b border-white/30 hover:bg-white/50 transition-colors group row-hover">
                <td className="px-3 py-2 font-mono text-slate-600" data-label="PID">
                  {p.pid}
                </td>
                <td className="px-3 py-2 font-medium" data-label="Command">
                  {p.command}
                </td>
                <td
                  className={cn(
                    "px-3 py-2 font-mono text-right",
                    p.cpu > 40 && "text-amber-600"
                  )}
                  data-label="CPU %"
                >
                  {p.cpu.toFixed(1)}
                </td>
                <td
                  className={cn(
                    "px-3 py-2 font-mono text-right",
                    p.mem > 80 && "text-red-600"
                  )}
                  data-label="MEM %"
                >
                  {p.mem.toFixed(1)}
                </td>
                <td className="px-3 py-2" data-label="Status">
                  <span className="inline-flex items-center gap-1">
                    {statusIcon(p.status)}
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Hardware panel                                                             */
/* -------------------------------------------------------------------------- */

interface HardwarePanelProps {
  thermal: { label: string; value: number; color: string }[];
}

export function HardwarePanel({ thermal }: HardwarePanelProps) {
  const [toggles, setToggles] = useState({ turbo: true, sleep: false });

  return (
    <div className="w-full lg:w-72 shrink-0 flex flex-col gap-3 md:gap-4 min-h-0 overflow-visible lg:overflow-y-auto">
      <div className="glass-card p-3">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Hardware Toggles
        </h3>
        <div className="flex flex-col gap-2">
          <label htmlFor="turbo-boost-switch" className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/50 cursor-pointer group">
            <span className="text-xs font-medium text-slate-700 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
              Turbo Boost
            </span>
            <button
              id="turbo-boost-switch"
              type="button"
              role="switch"
              aria-label="Turbo Boost"
              aria-checked={toggles.turbo}
              className={cn(
                "w-8 h-4 rounded-full relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                toggles.turbo ? "bg-blue-500" : "bg-slate-300"
              )}
              onClick={() => setToggles((s) => ({ ...s, turbo: !s.turbo }))}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform",
                  toggles.turbo && "translate-x-4"
                )}
              />
            </button>
          </label>
          <label htmlFor="deep-sleep-switch" className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/50 cursor-pointer group">
            <span className="text-xs font-medium text-slate-700 flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
              Deep Sleep
            </span>
            <button
              id="deep-sleep-switch"
              type="button"
              role="switch"
              aria-label="Deep Sleep"
              aria-checked={toggles.sleep}
              className={cn(
                "w-8 h-4 rounded-full relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                toggles.sleep ? "bg-blue-500" : "bg-slate-300"
              )}
              onClick={() => setToggles((s) => ({ ...s, sleep: !s.sleep }))}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform",
                  toggles.sleep && "translate-x-4"
                )}
              />
            </button>
          </label>
        </div>
      </div>

      <div className="glass-card p-3 flex flex-col flex-1 min-h-0">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Thermal Distribution
        </h3>
        <div className="flex-1 min-h-[6rem] bg-white/30 rounded-md border border-white/50 flex items-end p-1 gap-0.5">
          {thermal.map((t) => (
            <div
              key={t.label}
              className="w-full rounded-sm transition-all"
              style={{ height: `${t.value}%`, backgroundColor: t.color, opacity: 0.85 }}
              title={`${t.label}: ${t.value}°C`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Disk usage & top services                                                  */
/* -------------------------------------------------------------------------- */

interface DiskUsageProps {
  disks: Disk[];
  topServices: { name: string; pid: number; cpu: number; mem: number }[];
}

export function DiskAndServices({ disks, topServices }: DiskUsageProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-[1920px]:grid-cols-6 gap-3 md:gap-4">
      <div className="glass-card p-3 flex flex-col gap-3 min-[1920px]:col-span-3">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Disk Usage</h3>
        <div className="flex flex-wrap items-center justify-around gap-4">
          {disks.map((d) => (
            <div key={d.label} className="flex flex-col items-center gap-1">
              <div
                className="radial-progress"
                style={{ ["--progress-color" as string]: d.color, ["--progress-value" as string]: d.value }}
              >
                <span>{d.value}%</span>
              </div>
              <span className="text-[10px] font-medium text-slate-600">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-3 flex flex-col gap-3 min-[1920px]:col-span-3">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Top Services</h3>
        <div className="flex flex-col gap-2">
          {topServices.map((s) => (
            <div
              key={s.pid}
              className="flex items-center justify-between p-2 rounded-lg bg-white/40 hover:bg-white/60 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-700">{s.name}</span>
                <span className="text-[10px] font-mono text-slate-500">PID {s.pid}</span>
              </div>
              <div className="flex gap-3 text-[10px] font-mono">
                <span className={cn(s.cpu > 40 && "text-amber-600")}>CPU {s.cpu.toFixed(1)}</span>
                <span className={cn(s.mem > 80 && "text-red-600")}>MEM {s.mem.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Charts                                                                     */
/* -------------------------------------------------------------------------- */

interface ChartHandle {
  destroy: () => void;
  update: () => void;
  data: { datasets: Array<{ data: number[] }> };
}

export function ChartsSection() {
  const cpuRef = useRef<HTMLCanvasElement>(null);
  const reqRef = useRef<HTMLCanvasElement>(null);
  const breakdownRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    const charts: ChartHandle[] = [];

    async function render() {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;

      const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
        animation: { duration: 900, easing: "easeOutQuart" as const },
      };

      function cpuData(time: number) {
        return Array.from({ length: 6 }, (_, i) => noise(42, 4, time + i * 0.4));
      }
      function reqData(time: number) {
        return Array.from({ length: 6 }, (_, i) => noise(55, 25, time * 1.2 + i * 0.6));
      }
      function breakdownData(time: number) {
        const bases = [55, 25, 12, 8];
        const mults = [10, 8, 4, 4];
        const values = bases.map((base, i) => noise(base, mults[i], time * 0.5 + i));
        const total = values.reduce((a, b) => a + b, 0);
        return values.map((v) => (v / total) * 100);
      }

      if (cpuRef.current) {
        charts.push(
          new Chart(cpuRef.current, {
            type: "line",
            data: {
              labels: ["00", "04", "08", "12", "16", "20"],
              datasets: [
                {
                  data: cpuData(Date.now() / 4000),
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59,130,246,0.15)",
                  fill: true,
                  tension: 0.4,
                  pointRadius: 0,
                },
              ],
            },
            options: commonOptions,
          }) as ChartHandle
        );
      }
      if (reqRef.current) {
        charts.push(
          new Chart(reqRef.current, {
            type: "bar",
            data: {
              labels: ["A", "B", "C", "D", "E", "F"],
              datasets: [
                {
                  data: reqData(Date.now() / 4000),
                  backgroundColor: ["#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981", "#6366f1"],
                  borderRadius: 4,
                },
              ],
            },
            options: commonOptions,
          }) as ChartHandle
        );
      }
      if (breakdownRef.current) {
        charts.push(
          new Chart(breakdownRef.current, {
            type: "doughnut",
            data: {
              labels: ["Idle", "User", "Sys", "IO"],
              datasets: [
                {
                  data: breakdownData(Date.now() / 4000),
                  backgroundColor: ["#e2e8f0", "#3b82f6", "#8b5cf6", "#f59e0b"],
                  borderWidth: 0,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: "70%",
              plugins: { legend: { position: "bottom", labels: { font: { size: 10 }, boxWidth: 10 } } },
              animation: { duration: 900, easing: "easeOutQuart" as const },
            },
          }) as ChartHandle
        );
      }

      interval = setInterval(() => {
        const t = Date.now() / 4000;
        if (charts[0]) charts[0].data.datasets[0].data = cpuData(t);
        if (charts[1]) charts[1].data.datasets[0].data = reqData(t);
        if (charts[2]) charts[2].data.datasets[0].data = breakdownData(t);
        charts.forEach((c) => c.update());
      }, 2000);
    }

    render();
    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      charts.forEach((c) => c.destroy());
    };
  }, []);

  const cards = [
    { title: "CPU Trend", ref: cpuRef },
    { title: "Request Volume", ref: reqRef },
    { title: "CPU Breakdown", ref: breakdownRef },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 min-[1920px]:grid-cols-6 gap-3 md:gap-4">
      {cards.map((c) => (
        <div key={c.title} className="glass-card p-3 flex flex-col gap-2 min-[1920px]:col-span-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{c.title}</h3>
          <div className="relative h-40 w-full">
            <canvas ref={c.ref} aria-label={c.title} role="img" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Team & activity                                                            */
/* -------------------------------------------------------------------------- */

interface TeamAndActivityProps {
  team: TeamMember[];
  tasks: Task[];
  logs: Log[];
}

export function TeamAndActivity({ team, tasks, logs }: TeamAndActivityProps) {
  function statusDot(status: TeamMember["status"]) {
    const color =
      status === "online" ? "bg-emerald-500" : status === "away" ? "bg-amber-500" : "bg-slate-400";
    return <span className={cn("w-2 h-2 rounded-full", color)} aria-label={`Status: ${status}`} role="img" />;
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 min-[1920px]:grid-cols-6 gap-3 md:gap-4">
      <div className="glass-card p-3 flex flex-col gap-3 min-[1920px]:col-span-4 lg:col-span-2 lg:row-span-2">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Team Directory</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {team.length === 0 && (
            <p className="text-xs text-slate-500 col-span-full">Loading team...</p>
          )}
          {team.map((m) => (
            <div
              key={m.id}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/40 hover:bg-white/60 transition-colors text-center"
            >
              <div className="relative">
                <Image
                  src={m.avatar}
                  alt={m.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-12 h-12"
                  unoptimized
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white">
                  {statusDot(m.status)}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-700 truncate w-full">{m.name}</span>
              <span className="text-[9px] text-slate-500">{m.role}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-3 flex flex-col gap-2 min-[1920px]:col-span-1 lg:col-span-1">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending Tasks</h3>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable region must be focusable */}
        <ul tabIndex={0} aria-label="Pending tasks" className="flex flex-col gap-1.5 overflow-auto max-h-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
          {tasks.map((t) => (
            <li
              key={t.id}
              className={cn(
                "flex items-start gap-2 p-1.5 rounded-lg text-[11px]",
                t.completed ? "bg-emerald-50 text-emerald-700" : "bg-white/40 text-slate-700"
              )}
            >
              {t.completed ? (
                <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              )}
              <span className="line-clamp-2">{t.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card p-3 flex flex-col gap-2 min-[1920px]:col-span-1 lg:col-span-1">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">System Logs</h3>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable region must be focusable */}
        <ul tabIndex={0} aria-label="System logs" className="flex flex-col gap-1.5 overflow-auto max-h-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
          {logs.map((l) => (
            <li key={l.id} className="p-1.5 rounded-lg bg-white/40 text-[11px] text-slate-700">
              <div className="font-medium truncate">{l.title}</div>
              <div className="text-[9px] text-slate-500 flex justify-between mt-0.5">
                <span className="truncate max-w-[80%]">{l.body}</span>
                <span className="font-mono shrink-0">{l.timestamp}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Status & controls                                                          */
/* -------------------------------------------------------------------------- */

interface StatusControlsProps {
  controls: Control[];
}

function controlIcon(label: string) {
  const icons: Record<string, React.ReactNode> = {
    "API Gateway": <Network className="w-4 h-4" aria-hidden="true" />,
    "Auth Service": <Lock className="w-4 h-4" aria-hidden="true" />,
    "Queue Worker": <Clock className="w-4 h-4" aria-hidden="true" />,
    "Search Index": <Database className="w-4 h-4" aria-hidden="true" />,
    "Object Store": <Cloud className="w-4 h-4" aria-hidden="true" />,
    Notification: <AlertTriangle className="w-4 h-4" aria-hidden="true" />,
    "Cache Cluster": <MemoryStick className="w-4 h-4" aria-hidden="true" />,
    Logging: <FileText className="w-4 h-4" aria-hidden="true" />,
    "Metrics DB": <Activity className="w-4 h-4" aria-hidden="true" />,
  };
  return icons[label] ?? <Server className="w-4 h-4" aria-hidden="true" />;
}

export function StatusControls({ controls }: StatusControlsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 min-[1920px]:grid-cols-6 gap-3 md:gap-4">
      {controls.map((c) => (
        <div
          key={c.label}
          className="glass-card p-3 card-hover flex items-center justify-between min-[1920px]:col-span-2"
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                c.status === "healthy" && "bg-emerald-500",
                c.status === "warning" && "bg-amber-500",
                c.status === "critical" && "bg-red-500"
              )}
            >
              {controlIcon(c.label)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-700">{c.label}</span>
              <span className="text-[10px] text-slate-500 capitalize">{c.status}</span>
            </div>
          </div>
          <span className="text-sm font-bold text-slate-800 font-mono">{c.value}</span>
        </div>
      ))}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Pipeline & inventory                                                       */
/* -------------------------------------------------------------------------- */

interface PipelineInventoryProps {
  inventory: InventoryItem[];
}

export function PipelineInventory({ inventory }: PipelineInventoryProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-[1920px]:grid-cols-6 gap-3 md:gap-4">
      <div className="glass-card p-3 flex flex-col gap-3 min-[1920px]:col-span-3">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Deployment Pipeline</h3>
        <div className="flex items-center gap-2">
          {[
            { stage: "Build", status: "passed" as const },
            { stage: "Test", status: "passed" as const },
            { stage: "Lint", status: "passed" as const },
            { stage: "Deploy", status: "running" as const },
          ].map((s, i, arr) => (
            <div key={s.stage} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium",
                  s.status === "passed"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-blue-50 text-blue-700 border border-blue-100"
                )}
              >
                {s.status === "passed" ? <Check className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                {s.stage}
              </div>
              {i < arr.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-3 flex flex-col gap-3 min-[1920px]:col-span-3">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inventory</h3>
        <div className="grid grid-cols-3 gap-2">
          {inventory.map((item) => (
            <div key={item.name} className="flex flex-col gap-1 p-2 rounded-lg bg-white/40 text-center">
              <span className={cn("w-3 h-3 rounded-full mx-auto", item.color)} />
              <span className="text-lg font-bold text-slate-800 font-mono">{item.count}</span>
              <span className="text-[9px] text-slate-500 leading-tight">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Media gallery                                                              */
/* -------------------------------------------------------------------------- */

export function MediaGallery() {
  const images = [
    "https://picsum.photos/seed/telemetry1/400/220",
    "https://picsum.photos/seed/telemetry2/400/220",
    "https://picsum.photos/seed/telemetry3/400/220",
    "https://picsum.photos/seed/telemetry4/400/220",
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 min-[1920px]:grid-cols-6 gap-3 md:gap-4">
      {images.map((src, i) => (
        <div
          key={src}
          className="glass-card p-0 overflow-hidden card-hover min-[1920px]:col-span-3 lg:col-span-2"
        >
          <Image
            src={src}
            alt=""
            width={400}
            height={220}
            className="w-full h-auto object-cover"
            unoptimized
          />
          <div className="px-3 py-2 text-[10px] font-medium text-slate-600">Asset {i + 1}</div>
        </div>
      ))}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Forms                                                                      */
/* -------------------------------------------------------------------------- */

export function FormsSection() {
  const [incidentMsg, setIncidentMsg] = useState("");
  const [configMsg, setConfigMsg] = useState("");

  function onIncident(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIncidentMsg("Incident reported successfully.");
    setTimeout(() => setIncidentMsg(""), 3000);
  }

  function onConfig(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setConfigMsg("Node configuration saved.");
    setTimeout(() => setConfigMsg(""), 3000);
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <form onSubmit={onIncident} className="glass-card p-4 flex flex-col gap-3">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Report Incident</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-[11px] text-slate-700">
            Name
            <input required type="text" placeholder="e.g. Jane Doe" className="px-2 py-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-xs text-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1 text-[11px] text-slate-700">
            Email
            <input required type="email" placeholder="ops@example.com" className="px-2 py-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-xs text-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1 text-[11px] text-slate-700 sm:col-span-2">
            Severity
            <select className="px-2 py-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[11px] text-slate-700 sm:col-span-2">
            Description
            <textarea rows={3} placeholder="Briefly describe the incident..." className="px-2 py-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-xs text-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </label>
        </div>
        <button
          type="submit"
          className="self-start px-4 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none active:scale-[0.98] transition-colors"
        >
          Submit Incident
        </button>
        {incidentMsg && <p className="text-[11px] text-emerald-600" aria-live="polite" aria-atomic="true">{incidentMsg}</p>}
      </form>

      <form onSubmit={onConfig} className="glass-card p-4 flex flex-col gap-3">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Node Config</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-[11px] text-slate-700">
            Node ID
            <input defaultValue="0x4A" type="text" placeholder="0x4A" className="px-2 py-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-xs font-mono text-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1 text-[11px] text-slate-700">
            Region
            <select className="px-2 py-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>us-east-1</option>
              <option>eu-west-1</option>
              <option>ap-south-1</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[11px] text-slate-700 sm:col-span-2">
            Tags
            <input type="text" placeholder="production, api, cache" className="px-2 py-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-xs text-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </label>
          <label className="flex items-center gap-2 text-[11px] text-slate-700 sm:col-span-2">
            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            Enable telemetry streaming
          </label>
        </div>
        <button
          type="submit"
          className="self-start px-4 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none active:scale-[0.98] transition-colors"
        >
          Save Config
        </button>
        {configMsg && <p className="text-[11px] text-emerald-600" aria-live="polite" aria-atomic="true">{configMsg}</p>}
      </form>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Alerts feed                                                                */
/* -------------------------------------------------------------------------- */

interface AlertsFeedProps {
  alerts: Alert[];
}

function alertIcon(level: Alert["level"]) {
  if (level === "critical") return <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />;
  if (level === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" />;
  return <Info className="w-4 h-4 text-blue-500" aria-hidden="true" />;
}

export function AlertsFeed({ alerts }: AlertsFeedProps) {
  return (
    <section className="glass-card p-3 flex flex-col gap-2">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recent Alerts</h3>
      <ul className="flex flex-col gap-1.5">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="flex items-start gap-2 p-2 rounded-lg bg-white/40 hover:bg-white/60 transition-colors"
          >
            {alertIcon(a.level)}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">{a.message}</p>
              <p className="text-[10px] text-slate-500">{a.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
