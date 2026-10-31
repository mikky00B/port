import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatPostDate } from "@/lib/format";
import type { PostSummary } from "@/lib/posts";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Card className="group relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-dim">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true">/</span>
            <span>{post.readingTime} min read</span>
            {post.series && post.seriesOrder ? (
              <>
                <span aria-hidden="true">/</span>
                <span>
                  {post.series} · part {post.seriesOrder}
                </span>
              </>
            ) : null}
            {post.draft ? (
              <span className="rounded border border-line px-1.5 py-0.5 text-warning">draft</span>
            ) : null}
          </div>
          <h3 className="mt-2 font-heading text-xl font-semibold text-text">
            <Link className="focus-ring rounded after:absolute after:inset-0" href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{post.description}</p>
          {post.tags.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="font-mono text-xs text-dim">
                  #{tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <span className="hidden shrink-0 text-dim transition group-hover:text-text sm:block" aria-hidden="true">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Card>
  );
}
