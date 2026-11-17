import type { TocItem } from "@/lib/posts";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Table of contents">
      <div className="sticky top-24">
        <p className="font-mono text-xs tracking-[0.14em] text-ash">on this page</p>
        <ul className="mt-4 border-l border-bone/10">
          {items.map((item) => (
            <li key={item.id}>
              <a
                className="-ml-px block border-l border-transparent py-1 pl-3 text-sm leading-6 text-moss transition hover:border-gilt hover:text-bone"
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
