import Link from "next/link";
import { commitHash } from "@/lib/tree-content";
import { formatPostDate } from "@/lib/format";
import type { PostSummary } from "@/lib/posts";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative rounded-md border border-bone/[0.12] bg-sheet/60 px-5 py-4 transition-colors duration-200 hover:border-gilt/40 hover:bg-sheet">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-ash/80">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true">/</span>
            <span>{post.readingTime} min read</span>
            {post.series && post.seriesOrder ? (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-gilt/80">
                  {post.series} · part {post.seriesOrder}
                </span>
              </>
            ) : null}
            <span aria-hidden="true">/</span>
            <span className="text-ash/60">{commitHash(post.slug)}</span>
            {post.draft ? (
              <span className="rounded border border-gilt/40 px-1.5 py-0.5 text-gilt">draft</span>
            ) : null}
          </div>
          <h3 className="mt-2 text-[17px] font-medium tracking-wide text-glint">
            <Link className="focus-ring rounded after:absolute after:inset-0" href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-moss">{post.description}</p>
          {post.tags.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2 font-mono text-[11px] text-ash/70">
              {post.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <span
          className="hidden shrink-0 font-mono text-sm text-ash/50 transition group-hover:text-gilt sm:block"
          aria-hidden="true"
        >
          ↗
        </span>
      </div>
    </article>
  );
}
