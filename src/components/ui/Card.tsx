import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-lg border border-line bg-panel/85 p-5 shadow-glow backdrop-blur", className)}>
      {children}
    </div>
  );
}
