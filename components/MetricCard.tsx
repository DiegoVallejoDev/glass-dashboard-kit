"use client";

import { cn } from "@/lib/utils";
import { Activity, Clock, Cpu, MemoryStick, type LucideIcon } from "lucide-react";
import type { Metric } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  Cpu,
  MemoryStick,
  Clock,
  Activity,
};

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const Icon = iconMap[metric.icon] ?? Activity;
  const positive = metric.positive ?? true;
  return (
    <div className="glass-card p-3 card-hover flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{metric.label}</span>
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Icon className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-slate-800">{metric.value}</span>
        <span
          className={cn(
            "text-[10px] font-medium mb-1",
            positive ? "text-emerald-600" : "text-amber-600"
          )}
        >
          {metric.delta}
        </span>
      </div>
    </div>
  );
}
