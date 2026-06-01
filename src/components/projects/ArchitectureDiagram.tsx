import { Card } from "@/components/ui/Card";

export function ArchitectureDiagram({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div key={item} className="grid gap-3">
          <Card className="p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-text">{item}</span>
              <span className="font-mono text-xs text-dim">0{index + 1}</span>
            </div>
          </Card>
          {index < items.length - 1 ? <div className="ml-5 h-5 w-px bg-line" aria-hidden="true" /> : null}
        </div>
      ))}
    </div>
  );
}
