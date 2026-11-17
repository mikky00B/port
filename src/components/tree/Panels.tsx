"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type {
  TreeContent,
  TreeLink,
  TreeProject,
} from "@/lib/tree-content";
import type { Route } from "@/hooks/useHashRoute";

/* ---------------------------------- bits ---------------------------------- */

function StatusChip({ status }: { status: string }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-gilt">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gilt opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gilt" />
        </span>
        live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-ash">
      <span className="h-1.5 w-1.5 rounded-full border border-ash" />
      {status}
    </span>
  );
}

function Links({ links }: { links: TreeLink[] }) {
  if (!links.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
      {links.map((l) => {
        const arrow = (
          <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        );
        if (l.download) {
          return (
            <a
              key={l.label}
              href={l.href}
              download
              className="group inline-flex items-center gap-1 font-mono text-xs text-fog underline decoration-fog/30 underline-offset-4 transition-colors hover:text-bone hover:decoration-bone/70"
            >
              {l.label}
              {arrow}
            </a>
          );
        }
        if (!l.external) {
          return (
            <Link
              key={l.label}
              href={l.href}
              className="group inline-flex items-center gap-1 font-mono text-xs text-fog underline decoration-fog/30 underline-offset-4 transition-colors hover:text-bone hover:decoration-bone/70"
            >
              {l.label}
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          );
        }
        return (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 font-mono text-xs text-fog underline decoration-fog/30 underline-offset-4 transition-colors hover:text-bone hover:decoration-bone/70"
          >
            {l.label}
            {arrow}
          </a>
        );
      })}
    </div>
  );
}

function ProjectRow({ p }: { p: TreeProject }) {
  return (
    <article className="border-b border-bone/10 py-6 first:pt-2 last:border-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-[17px] font-medium tracking-wide text-glint">
          {p.name}
        </h3>
        <StatusChip status={p.status} />
        <span className="font-mono text-[11px] text-ash/80">{p.hash}</span>
      </div>
      <p className="mt-1 font-mono text-[11px] text-ash/60">
        {p.branch} · {p.tags.join(" / ")}
      </p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-moss">{p.desc}</p>
      <Links links={p.links} />
    </article>
  );
}

function Note({
  children,
  className = "",
  rotate = "-rotate-1",
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: string;
}) {
  return (
    <div
      className={`pointer-events-none select-none font-hand text-[17px] leading-snug text-note/85 ${rotate} ${className}`}
    >
      {children}
    </div>
  );
}

function HandArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 34"
      fill="none"
      aria-hidden="true"
      className={`h-6 w-11 text-note/70 ${className}`}
    >
      <path
        d="M4 4 C 18 10, 34 12, 50 22"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M50 22 l -7 -1 M50 22 l -3 -6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SocialRows({ content }: { content: TreeContent }) {
  return (
    <div className="mt-3 flex flex-col gap-2.5">
      {content.socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.external ? "_blank" : undefined}
          rel={s.external ? "noopener noreferrer" : undefined}
          {...(s.download ? { download: true } : {})}
          className="group flex items-center justify-between gap-4 border-b border-bone/10 pb-2.5 text-[13.5px] text-moss transition-colors hover:text-glint"
        >
          <span className="font-mono text-xs text-ash group-hover:text-gilt">
            {s.label}
          </span>
          <span className="flex items-center gap-1.5 break-all text-right font-mono text-[12px]">
            {s.value}
            <span className="inline-block shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}

/* ------------------------------ panel shell ------------------------------- */

const ROUTE_TO_BRANCH: Record<Exclude<Route, "">, string> = {
  work: "feat/work",
  writing: "docs/writing",
  me: "about/me",
  contact: "ping/contact",
};

export function Panel({
  route,
  content,
  onClose,
}: {
  route: Exclude<Route, "">;
  content: TreeContent;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-label={route}
      className="panel-in pointer-events-auto fixed inset-x-3 bottom-16 top-14 z-30 overflow-hidden rounded-lg border border-bone/[0.12] bg-sheet/[0.92] shadow-[0_18px_60px_rgba(0,0,0,0.5)] outline-none backdrop-blur-sm md:inset-x-auto md:bottom-6 md:right-6 md:top-20 md:w-[min(560px,44vw)]"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-bone/10 px-6 py-4">
          <div>
            <p className="font-mono text-[11px] text-ash">
              $ git checkout {ROUTE_TO_BRANCH[route]}
            </p>
            <h2 className="mt-0.5 text-[19px] font-medium tracking-wide text-glint">
              {route}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="back to the tree"
            className="group flex items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-[11px] text-ash transition-colors hover:bg-bone/[0.08] hover:text-bone"
          >
            <span className="text-[13px] leading-none">×</span>
            <span className="hidden sm:inline">esc</span>
          </button>
        </header>
        <div className="nice-scroll flex-1 overflow-y-auto px-6 py-5">
          {route === "work" && <WorkContent content={content} />}
          {route === "writing" && <WritingContent content={content} />}
          {route === "me" && <MeContent content={content} />}
          {route === "contact" && <ContactContent content={content} />}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- contents -------------------------------- */

function WorkContent({ content }: { content: TreeContent }) {
  return (
    <div>
      <Note className="mb-5 flex items-end gap-2">
        <HandArrow className="rotate-[160deg]" />
        <span>
          every branch here is something i shipped — the recent ones are all
          live, go poke them.
        </span>
      </Note>

      <p className="font-mono text-[11px] text-ash">
        $ git log --oneline main --recent
      </p>
      <div className="mt-2">
        {content.live.map((p) => (
          <ProjectRow key={p.name} p={p} />
        ))}
      </div>

      <p className="mt-8 font-mono text-[11px] text-ash">
        $ git branch --archived
      </p>
      <div className="mt-2 opacity-80">
        {content.archived.map((p) => (
          <ProjectRow key={p.name} p={p} />
        ))}
      </div>
      <Note className="mt-4 pl-1" rotate="rotate-1">
        archived ≠ dead — the code still runs, the lessons still count.
      </Note>
    </div>
  );
}

function WritingContent({ content }: { content: TreeContent }) {
  return (
    <div>
      <Note className="mb-5" rotate="-rotate-1">
        same brain as the code, longer format — these open on the full blog.
      </Note>
      <p className="font-mono text-[11px] text-ash">$ ls ~/writing --by-date</p>
      <div className="mt-2">
        {content.posts.map((post) => (
          <article
            key={post.title}
            className="border-b border-bone/10 py-6 first:pt-2 last:border-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[16.5px] font-medium leading-snug tracking-wide text-glint">
                {post.title}
              </h3>
              <span className="font-mono text-[11px] text-ash/80">
                {post.date} · {post.read}
              </span>
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-moss">
              {post.desc}
            </p>
            <div className="mt-2.5 font-mono text-[11px] text-ash/70">
              {post.tags.map((tg) => `#${tg}`).join(" ")}
            </div>
            <div className="mt-3">
              <Link
                href={post.href}
                className="group inline-flex items-center gap-1 font-mono text-xs text-fog underline decoration-fog/30 underline-offset-4 transition-colors hover:text-bone hover:decoration-bone/70"
              >
                read
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 font-mono text-[11.5px] text-bone/90 underline decoration-gilt/60 underline-offset-4 transition-colors hover:text-white hover:decoration-gilt"
        >
          open the full blog
          <span className="inline-block transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

function MeContent({ content }: { content: TreeContent }) {
  return (
    <div>
      <Note className="mb-5" rotate="-rotate-1">
        the short version: i make servers behave.
      </Note>
      <div className="space-y-4 text-[13.5px] leading-relaxed text-moss">
        <p>
          i&apos;m{" "}
          <span className="text-glint">{content.profile.name.toLowerCase()}</span>{" "}
          — a self-taught software engineer working in{" "}
          <span className="font-mono text-[12.5px] text-gilt">
            python
          </span>{" "}
          &amp;{" "}
          <span className="font-mono text-[12.5px] text-gilt">go</span>,
          focused on backend systems, infrastructure and developer tools.
        </p>
        <p>
          i learned by shipping things and fixing them when they broke,
          which is probably why i care this much about software that tells
          you when it&apos;s unhappy.
        </p>
        <p>
          day to day i freelance: designing, building and maintaining the
          backend systems behind real products.
        </p>
        <p>
          away from software, i play chess every day, some tennis, read
          technical papers for fun. i also write about how the pieces fit:
          system designs and other technical concepts
        </p>
      </div>

      <div className="mt-7 rounded-md border border-bone/[0.12] bg-soot/60 px-4 py-3.5">
        <p className="font-mono text-[11px] text-ash">currently building</p>
        <p className="mt-1.5 flex items-center gap-2 text-[13.5px] text-glint">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gilt opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gilt" />
          </span>
          {content.profile.current}
        </p>
      </div>

      <p className="mt-8 font-mono text-[11px] text-ash">$ cat elsewhere.txt</p>
      <SocialRows content={content} />
    </div>
  );
}

function ContactContent({ content }: { content: TreeContent }) {
  return (
    <div>
      <Note className="mb-5" rotate="-rotate-1">
        no forms here — just a plain old inbox. i read everything.
      </Note>
      <p className="text-[13.5px] leading-relaxed text-moss">
        interested in working together, hiring me, or discussing a backend
        project? reach me directly through email or any of the links below —
        roles, freelance work, and collaborations are all welcome.
      </p>

      <a
        href={`mailto:${content.profile.email}`}
        className="mt-7 block rounded-md border border-bone/15 bg-soot/60 px-5 py-4 transition-colors hover:border-gilt/50"
      >
        <p className="font-mono text-[11px] text-ash">fastest route — email</p>
        <p className="mt-1.5 flex items-center gap-2 text-[15px] text-glint">
          {content.profile.email}
          <span className="inline-block transition-transform hover:translate-x-0.5 hover:-translate-y-0.5">
            ↗
          </span>
        </p>
      </a>

      <p className="mt-8 font-mono text-[11px] text-ash">$ cat contact.txt</p>
      <SocialRows content={content} />
    </div>
  );
}
