import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  id?: string;
  className?: string;
}

export function SectionHeader({ title, id, className }: SectionHeaderProps) {
  return (
    <h2
      id={id}
      className={cn(
        "text-[10px] font-bold uppercase tracking-wider text-slate-600 py-1",
        className
      )}
    >
      {title}
    </h2>
  );
}
