import { cn } from "@/lib/utils";

const tones = {
  green: "bg-text shadow-[0_0_0_5px_rgba(255,255,255,0.10)]",
  gray: "bg-dim shadow-[0_0_0_5px_rgba(255,255,255,0.08)]",
  amber: "bg-muted shadow-[0_0_0_5px_rgba(255,255,255,0.10)]"
};

export function StatusDot({ tone = "green" }: { tone?: keyof typeof tones }) {
  return <span className={cn("h-2.5 w-2.5 rounded-full", tones[tone])} aria-hidden="true" />;
}
