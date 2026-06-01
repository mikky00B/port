import { cn } from "@/lib/utils";

const tones = {
  green: "bg-success shadow-[0_0_0_5px_rgba(34,197,94,0.12)]",
  cyan: "bg-accent shadow-[0_0_0_5px_rgba(56,189,248,0.12)]",
  gray: "bg-dim shadow-[0_0_0_5px_rgba(107,114,128,0.12)]",
  amber: "bg-warning shadow-[0_0_0_5px_rgba(245,158,11,0.12)]"
};

export function StatusDot({ tone = "green" }: { tone?: keyof typeof tones }) {
  return <span className={cn("h-2.5 w-2.5 rounded-full", tones[tone])} aria-hidden="true" />;
}
