"use client";

import { useEffect } from "react";
import TreeCanvas from "@/components/tree/TreeCanvas";
import { Panel } from "@/components/tree/Panels";
import { useHashRoute, type Route } from "@/hooks/useHashRoute";
import type { TreeContent } from "@/lib/tree-content";

const NAV_ITEMS: { key: Route | "home"; label: string; href: string }[] = [
  { key: "home", label: "tree", href: "#/" },
  { key: "work", label: "work", href: "#/work" },
  { key: "writing", label: "writing", href: "#/writing" },
  { key: "me", label: "me", href: "#/me" },
  { key: "contact", label: "contact", href: "#/contact" },
];

function GrainOverlay() {
  return (
    <svg
      aria-hidden="true"
      className="grain-jitter pointer-events-none fixed -inset-8 z-[60] opacity-[0.13] mix-blend-overlay"
    >
      <filter id="cm-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.82"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#cm-grain)" />
    </svg>
  );
}

function HandNote({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none select-none font-hand text-[18px] leading-snug text-note/80 ${className}`}
    >
      {children}
    </div>
  );
}

export function TreeHome({ content }: { content: TreeContent }) {
  const { route, navigate } = useHashRoute();
  const open = route !== "";

  useEffect(() => {
    document.title = route
      ? `${route} — clevermike`
      : "clevermike (⌐■_■)";
  }, [route]);

  return (
    <div className="tree-scene fixed inset-0 z-[70] overflow-hidden bg-bark text-bone">
      {/* the living scene */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${
          open ? "opacity-40" : "opacity-100"
        }`}
      >
        <TreeCanvas
          onNavigate={(nav) => navigate(nav === "home" ? "" : (nav as Route))}
          className="h-full w-full"
        />
      </div>

      {/* vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[55]"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 46%, transparent 55%, rgba(9,8,7,0.42) 100%)",
        }}
      />

      {/* title — click returns to the tree */}
      <a
        href="#/"
        className="fixed left-6 top-5 z-40 flex items-baseline gap-2.5 md:left-8 md:top-6"
      >
        <span className="text-[14px] font-medium tracking-wide text-glint">
          Clevermike&apos;s studio
        </span>
        <span className="font-mono text-[11px] text-ash">(⌐■_■)</span>
      </a>

      {/* copyright — top right */}
      <p className="fixed right-6 top-5 z-40 hidden font-mono text-[10px] text-ash/70 md:block md:right-8 md:top-6">
        © 2026 michael abulude
      </p>

      {/* home-only: handwritten annotations */}
      {!open && (
        <>
          <HandNote className="absolute left-[4%] top-[38%] hidden max-w-[180px] sm:block md:left-[7%] lg:left-[10%]">
            <span>yes — the tree is the menu. click a branch.</span>
            <svg
              viewBox="0 0 70 40"
              fill="none"
              aria-hidden="true"
              className="ml-20 mt-1 h-7 w-14 -rotate-[8deg] text-note/60"
            >
              <path
                d="M6 34 C 24 30, 46 24, 62 12"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M62 12 l -8 1 M62 12 l -3 7"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </HandNote>
          <div className="absolute bottom-[15%] right-[6%] hidden select-none items-center gap-2.5 sm:flex md:right-[9%]">
            {/* quiet clearing so the note reads over the grass */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-8 -inset-y-5"
              style={{
                background:
                  "radial-gradient(ellipse 55% 60% at 55% 50%, rgba(23,22,20,0.94) 30%, rgba(23,22,20,0) 75%)",
              }}
            />
            <div className="relative font-hand text-[18px] leading-snug text-note/80">
              currently building:
              <br />
              <span className="text-glint">{content.profile.current}</span>
            </div>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gilt opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gilt" />
            </span>
          </div>
        </>
      )}

      {/* home-only: quiet intro */}
      {!open && (
        <div className="fixed bottom-20 left-6 z-20 max-w-[300px] md:bottom-14 md:left-8 md:max-w-[340px]">
          {/* quiet clearing so the intro reads over the grass */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-10 -bottom-10 -top-8"
            style={{
              background:
                "radial-gradient(ellipse 55% 55% at 45% 55%, rgba(23,22,20,0.94) 30%, rgba(23,22,20,0) 75%)",
            }}
          />
          <div className="relative">
            <p className="text-[15px] font-medium tracking-wide text-glint">
              {content.profile.name.toLowerCase()}
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-ash">
              {content.profile.role.toLowerCase()} — {content.profile.intro}
            </p>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-fog">
              {content.profile.tagline}
            </p>
            <div className="mt-3.5 flex gap-5">
              <button
                onClick={() => navigate("work")}
                className="font-mono text-[11.5px] text-bone/90 underline decoration-gilt/60 underline-offset-4 transition-colors hover:text-white hover:decoration-gilt"
              >
                view projects →
              </button>
              <button
                onClick={() => navigate("contact")}
                className="font-mono text-[11.5px] text-fog underline decoration-fog/30 underline-offset-4 transition-colors hover:text-bone hover:decoration-bone/70"
              >
                say hello
              </button>
            </div>
          </div>
        </div>
      )}

      {/* content panel */}
      {open && (
        <Panel route={route} content={content} onClose={() => navigate("")} />
      )}

      {/* mobile nav pill (touch) */}
      <nav
        aria-label="sections"
        className="fixed inset-x-0 bottom-2.5 z-40 flex justify-center md:hidden"
      >
        <div className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-bone/[0.12] bg-sheet/90 px-1.5 py-1 shadow-lg backdrop-blur">
          {NAV_ITEMS.map((item) => {
            const active = (item.key === "home" && !open) || item.key === route;
            return (
              <a
                key={item.key}
                href={item.href}
                className={`rounded-full px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                  active
                    ? "bg-bone/[0.12] text-glint"
                    : "text-ash hover:text-bone"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      {/* screen-reader / keyboard navigation */}
      <nav aria-label="site" className="sr-only">
        {NAV_ITEMS.map((item) => (
          <a key={item.key} href={item.href}>
            {item.label === "tree" ? "home" : item.label}
          </a>
        ))}
      </nav>

      {/* film grain + frame */}
      <GrainOverlay />
      <div
        aria-hidden="true"
        className="sheet-frame pointer-events-none fixed inset-0 z-[70]"
      />
    </div>
  );
}
