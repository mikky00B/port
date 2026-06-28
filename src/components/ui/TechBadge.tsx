export function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-line bg-panel2 px-2.5 py-1 font-mono text-xs text-neutral-300">
      {children}
    </span>
  );
}
