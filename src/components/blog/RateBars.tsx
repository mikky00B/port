type RateBarRow = {
  label: string;
  value: number;
  display: string;
};

type RateBarsProps = {
  rows: RateBarRow[];
  max?: number;
  caption?: string;
};

export function RateBars({ rows, max, caption }: RateBarsProps) {
  const maxValue = max ?? Math.max(...rows.map((row) => row.value));

  return (
    <figure className="my-6">
      <div className="grid gap-4">
        {rows.map((row) => {
          const width = Math.max(2, Math.round((row.value / maxValue) * 100));
          return (
            <div key={row.label} className="grid gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs text-dim">{row.label}</span>
                <span className="font-mono text-xs text-text">{row.display}</span>
              </div>
              <div aria-hidden="true" className="h-2 rounded-full border border-line bg-panel">
                <div className="h-full rounded-full bg-dim" style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      {caption ? <figcaption className="mt-3 font-mono text-xs text-dim">{caption}</figcaption> : null}
    </figure>
  );
}
