import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  id?: string;
  className?: string;
}

export function SectionHeader({ title, id, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3 py-1", className)}>
      <span
        className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300/40 to-slate-300/40"
        aria-hidden="true"
      />
      <h2
        id={id}
        className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0"
      >
        {title}
      </h2>
      <span
        className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300/40 to-slate-300/40"
        aria-hidden="true"
      />
    </div>
  );
}
