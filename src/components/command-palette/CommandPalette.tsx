"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import { socials } from "@/data/socials";

type Command = {
  label: string;
  detail: string;
  href: string;
  external?: boolean;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const commands = useMemo<Command[]>(
    () => [
      { label: "Go to projects", detail: "Landing page project list", href: "/#projects" },
      { label: "Go to resume", detail: "Profile and skills", href: "/resume" },
      { label: "Go to contact", detail: "Email and links", href: "/contact" },
      { label: "Open GitHub", detail: socials.githubHandle, href: socials.github, external: true },
      ...projects.map((project) => ({
        label: project.title,
        detail: project.category,
        href: project.liveUrl ?? project.githubUrl ?? "/#projects",
        external: Boolean(project.liveUrl ?? project.githubUrl)
      }))
    ],
    []
  );

  const filtered = commands.filter((command) =>
    `${command.label} ${command.detail}`.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function run(command: Command) {
    setOpen(false);
    setQuery("");
    if (command.external) {
      window.open(command.href, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(command.href);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/72 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="mx-auto mt-24 max-w-2xl overflow-hidden rounded-lg border border-line bg-panel shadow-glow">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search className="h-5 w-5 text-dim" />
          <input
            autoFocus
            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-dim"
            placeholder="Search projects and pages..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.map((command) => (
            <button
              key={`${command.label}-${command.href}`}
              className="focus-ring flex w-full items-center justify-between rounded-md px-3 py-3 text-left hover:bg-panel2"
              type="button"
              onClick={() => run(command)}
            >
              <span className="font-medium text-text">{command.label}</span>
              <span className="text-xs text-dim">{command.detail}</span>
            </button>
          ))}
          {filtered.length === 0 ? <p className="px-3 py-8 text-center text-sm text-muted">No matching command.</p> : null}
        </div>
      </div>
    </div>
  );
}
