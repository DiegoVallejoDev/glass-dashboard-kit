export type ProcessStatus = "Running" | "Warning" | "Sleep";

export interface Process {
  pid: number;
  command: string;
  cpu: number;
  mem: number;
  status: ProcessStatus;
}

export const processes: Process[] = [
  { pid: 1042, command: "docker_daemon", cpu: 12.4, mem: 8.1, status: "Running" },
  { pid: 2105, command: "postgres_main", cpu: 45.2, mem: 32.4, status: "Running" },
  { pid: 8841, command: "redis_cache", cpu: 2.1, mem: 94.0, status: "Warning" },
  { pid: 9012, command: "nginx_worker", cpu: 0.5, mem: 1.2, status: "Sleep" },
];

export const thermal = [
  { label: "CPU", value: 30, color: "#60a5fa" },
  { label: "GPU", value: 45, color: "#3b82f6" },
  { label: "Memory", value: 60, color: "#2563eb" },
  { label: "SSD", value: 85, color: "#8b5cf6" },
  { label: "System", value: 70, color: "#f59e0b" },
  { label: "Fan", value: 95, color: "#ef4444" },
];

export interface Metric {
  label: string;
  value: string;
  delta: string;
  icon: string; // lucide icon name
  positive?: boolean;
}

export const metrics: Metric[] = [
  { label: "CPU Load", value: "42.8%", delta: "+2.4%", icon: "Cpu", positive: false },
  { label: "Memory", value: "6.2 GB", delta: "-0.8 GB", icon: "MemoryStick", positive: true },
  { label: "Uptime", value: "14d 03h", delta: "+0.2%", icon: "Clock", positive: true },
  { label: "Requests/s", value: "1,204", delta: "+12%", icon: "Activity", positive: true },
];

export interface Disk {
  label: string;
  value: number;
  color: string;
}

export const disks: Disk[] = [
  { label: "System", value: 72, color: "#3b82f6" },
  { label: "Data", value: 45, color: "#8b5cf6" },
  { label: "Logs", value: 88, color: "#f59e0b" },
];

export const topServices = [
  { name: "nginx_worker", pid: 9012, cpu: 0.5, mem: 1.2 },
  { name: "redis_cache", pid: 8841, cpu: 2.1, mem: 94.0 },
  { name: "postgres_main", pid: 2105, cpu: 45.2, mem: 32.4 },
  { name: "docker_daemon", pid: 1042, cpu: 12.4, mem: 8.1 },
];

export interface Alert {
  id: number;
  level: "critical" | "warning" | "info";
  message: string;
  time: string;
}

export const alerts: Alert[] = [
  { id: 1, level: "critical", message: "Redis memory usage above 90%", time: "2m ago" },
  { id: 2, level: "warning", message: "Postgres CPU spike detected", time: "14m ago" },
  { id: 3, level: "info", message: "Docker daemon restarted", time: "1h ago" },
  { id: 4, level: "info", message: "Backup completed successfully", time: "3h ago" },
];

export interface Control {
  label: string;
  status: "healthy" | "warning" | "critical";
  value: string;
}

export const controls: Control[] = [
  { label: "API Gateway", status: "healthy", value: "99.99%" },
  { label: "Auth Service", status: "healthy", value: "99.97%" },
  { label: "Queue Worker", status: "warning", value: "98.1%" },
  { label: "Search Index", status: "healthy", value: "99.95%" },
  { label: "Object Store", status: "healthy", value: "99.9%" },
  { label: "Notification", status: "critical", value: "96.4%" },
  { label: "Cache Cluster", status: "healthy", value: "99.98%" },
  { label: "Logging", status: "healthy", value: "99.92%" },
  { label: "Metrics DB", status: "warning", value: "97.3%" },
];

export const pipeline = [
  { stage: "Build", status: "passed" as const },
  { stage: "Test", status: "passed" as const },
  { stage: "Lint", status: "passed" as const },
  { stage: "Deploy", status: "running" as const },
];

export interface InventoryItem {
  name: string;
  count: number;
  color: string;
}

export const inventory: InventoryItem[] = [
  { name: "Compute nodes", count: 12, color: "bg-blue-500" },
  { name: "Storage volumes", count: 48, color: "bg-violet-500" },
  { name: "Network ifaces", count: 96, color: "bg-amber-500" },
];

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export const gallery: GalleryImage[] = Array.from({ length: 4 }, (_, i) => ({
  id: `img-${i + 1}`,
  src: `https://picsum.photos/seed/telemetry${i + 1}/400/220`,
  alt: `Telemetry asset ${i + 1}`,
}));

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "away";
}

export async function fetchTeam(): Promise<TeamMember[]> {
  try {
    const res = await fetch(
      "https://randomuser.me/api/?results=8&seed=telemetry",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Failed to fetch team");
    const data: { results?: unknown[] } = await res.json();
    return (data.results || []).map((u, idx) => {
      const user = u as {
        login?: { uuid?: string };
        name?: { first?: string; last?: string };
        picture?: { medium?: string };
      };
      return {
        id: user.login?.uuid || `u-${idx}`,
        name: `${user.name?.first || ""} ${user.name?.last || ""}`.trim(),
        role: ["SRE", "Backend", "DevOps", "Security", "Data"][idx % 5],
        avatar: user.picture?.medium || "",
        status: ["online", "away", "offline"][idx % 3] as TeamMember["status"],
      };
    });
  } catch {
    return [];
  }
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=6", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data: unknown[] = await res.json();
    return data.map((t) => {
      const todo = t as { id?: number; title?: string; completed?: boolean };
      return { id: todo.id ?? 0, title: todo.title ?? "", completed: todo.completed ?? false };
    });
  } catch {
    return [];
  }
}

export interface Log {
  id: number;
  title: string;
  body: string;
  timestamp: string;
}

export async function fetchLogs(): Promise<Log[]> {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=6", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch logs");
    const data: unknown[] = await res.json();
    return data.map((p, idx) => {
      const post = p as { id?: number; title?: string; body?: string };
      return {
        id: post.id ?? 0,
        title: post.title ?? "",
        body: post.body ?? "",
        timestamp: `${idx * 5 + 2}m ago`,
      };
    });
  } catch {
    return [];
  }
}
