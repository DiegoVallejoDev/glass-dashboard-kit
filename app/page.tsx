import { Dashboard } from "@/components/Dashboard";
import {
  alerts,
  controls,
  disks,
  fetchLogs,
  fetchTasks,
  fetchTeam,
  inventory,
  metrics,
  processes,
  thermal,
  topServices,
} from "@/lib/data";

export default async function HomePage() {
  const [team, tasks, logs] = await Promise.all([fetchTeam(), fetchTasks(), fetchLogs()]);

  return (
    <Dashboard
      metrics={metrics}
      processes={processes}
      thermal={thermal}
      disks={disks}
      topServices={topServices}
      team={team}
      tasks={tasks}
      logs={logs}
      controls={controls}
      inventory={inventory}
      alerts={alerts}
    />
  );
}
