"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/now", label: "Now" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/82 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link className="focus-ring rounded font-heading text-sm font-semibold tracking-wide text-text" href="/">
          clevermike
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : !item.href.includes("#") && pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                className={cn(
                  "focus-ring rounded-md px-3 py-2 text-sm transition",
                  active ? "bg-panel text-accent" : "text-muted hover:text-text"
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="ml-2 rounded-md border border-line px-2 py-1 font-mono text-xs text-dim">Ctrl K</span>
        </div>
        <button
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted md:hidden"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Open menu</span>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open ? (
        <div id="mobile-menu" className="border-t border-line bg-background px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="focus-ring block rounded-md px-3 py-3 text-sm text-muted hover:bg-panel hover:text-text"
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
