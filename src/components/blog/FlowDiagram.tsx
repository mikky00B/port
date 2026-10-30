import { Fragment } from "react";
import { cn } from "@/lib/utils";

type FlowDiagramProps = {
  steps: string[];
  highlight?: number[];
  caption?: string;
};

export function FlowDiagram({ steps, highlight = [], caption }: FlowDiagramProps) {
  return (
    <figure className="my-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {steps.map((step, index) => (
          <Fragment key={step}>
            {index > 0 ? (
              <span aria-hidden="true" className="font-mono text-xs text-dim">
                →
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-md border px-3 py-2 font-mono text-xs",
                highlight.includes(index) ? "border-accent bg-panel2 text-text" : "border-line bg-panel text-muted"
              )}
            >
              {step}
            </span>
          </Fragment>
        ))}
      </div>
      {caption ? <figcaption className="mt-3 font-mono text-xs text-dim">{caption}</figcaption> : null}
    </figure>
  );
}
