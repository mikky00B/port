"use client";

import { useEffect, useState } from "react";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function UpdatedStamp() {
  const [updated, setUpdated] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setUpdated(formatDate(new Date()));
    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-dim">
      {updated ? `Updated for ${updated}` : "Checking clock…"}
    </p>
  );
}
