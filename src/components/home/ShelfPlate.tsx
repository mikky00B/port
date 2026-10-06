"use client";

import { useEffect, useRef, useState } from "react";
import { getProject, projects, Project } from "@/data/projects";

// the shelf draws the live projects only, newest on top
const SHELF = projects.filter((p) => p.status !== "Archived");

function projectForSlug(slug: string): Project | null {
  return getProject(slug) ?? null;
}

export function ShelfPlate() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [active, setActive] = useState<Project | null>(null);

  function wire() {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!frame || !doc || !doc.body) return;
    if (doc.getElementById("shelf-plate-style")) return;
    // the figure's bench chrome is lab furniture; the plate keeps the drawing and the read-out only
    const style = doc.createElement("style");
    style.id = "shelf-plate-style";
    style.textContent =
      ".controls, #rules, #means { display: none !important; } #stage { cursor: pointer; }";
    doc.head.appendChild(style);
    const read = doc.getElementById("read");
    if (!read) return;
    const sync = () => {
      const slug = (read.textContent ?? "").trim();
      setActive(slug && slug !== "rest" ? projectForSlug(slug) : null);
    };
    sync();
    new MutationObserver(sync).observe(read, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    doc.addEventListener("click", () => {
      const slug = (read.textContent ?? "").trim();
      const project = slug && slug !== "rest" ? projectForSlug(slug) : null;
      const url = project?.liveUrl ?? project?.githubUrl;
      if (url) window.open(url, "_blank", "noopener");
    });
  }

  useEffect(() => {
    // the iframe can finish loading before React attaches onLoad
    if (frameRef.current?.contentDocument?.readyState === "complete") wire();
  }, []);

  const url = active ? active.liveUrl ?? active.githubUrl : undefined;
  const slot = active ? SHELF.findIndex((p) => p.slug === active.slug) + 1 : 0;

  return (
    <figure className="rounded-lg border border-line bg-panel/90 p-4 shadow-glow backdrop-blur">
      <figcaption className="flex items-center justify-between px-1 pb-3 font-mono text-xs uppercase tracking-[0.18em] text-dim">
        <span>Fig 1</span>
        <span>Project shelf</span>
      </figcaption>
      <iframe
        ref={frameRef}
        src="/hairline-shelf.html?theme=dark&w=460"
        title="Interactive index of Michael's projects: seven trays on a shelf, one per project"
        onLoad={wire}
        className="h-[420px] w-full rounded-md border border-line bg-black"
      />
      <figcaption
        className="flex items-center justify-between gap-4 px-1 pt-3 font-mono text-xs text-dim"
        aria-live="polite"
      >
        {active && url ? (
          <a className="truncate hover:text-text" href={url} rel="noreferrer" target="_blank">
            {active.title} · {active.status} ↗
          </a>
        ) : (
          <span>hover a tray · click to open</span>
        )}
        <span className="shrink-0">
          {active
            ? `${String(slot).padStart(2, "0")} / ${String(SHELF.length).padStart(2, "0")}`
            : "portfolio"}
        </span>
      </figcaption>
    </figure>
  );
}
