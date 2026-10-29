import type { TocItem } from "@/lib/posts";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Table of contents">
      <div className="sticky top-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">On this page</p>
        <ul className="mt-4 border-l border-line">
          {items.map((item) => (
            <li key={item.id}>
              <a
                className="-ml-px block border-l border-transparent py-1 pl-3 text-sm leading-6 text-muted transition hover:border-accent hover:text-text"
                style={item.depth === 3 ? { paddingLeft: "2rem" } : undefined}
                href={`#${item.id}`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
