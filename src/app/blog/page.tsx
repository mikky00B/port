import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/ui/Container";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "technical deep dives into real infrastructure: how the pieces fit, where they break, and what the design decisions actually cost.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/rss.xml"
    }
  }
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <p className="font-mono text-xs tracking-[0.14em] text-gilt">$ git log --oneline writing</p>
        <h1 className="mt-3 text-3xl font-medium tracking-wide text-glint sm:text-4xl">
          software systems, taken apart.
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-moss">
          technical deep dives into real infrastructure: how the pieces fit, where they break, and
          what the design decisions actually cost.
        </p>
      </div>

      {tags.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            className="focus-ring rounded border border-gilt/50 bg-gilt/10 px-2.5 py-1 font-mono text-xs text-gilt"
            href="/blog"
          >
            all {posts.length}
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag.tag}
              className="focus-ring rounded border border-bone/[0.12] px-2.5 py-1 font-mono text-xs text-ash transition hover:border-gilt/40 hover:text-gilt"
              href={`/blog/tag/${tag.tag}`}
            >
              #{tag.tag} {tag.count}
            </Link>
          ))}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <p className="mt-12 text-moss">no posts published yet.</p>
      ) : null}

      <div className="mt-12 space-y-12">
        {years.map((year) => (
          <section key={year}>
            <div className="flex items-center gap-4">
              <h2 className="font-mono text-xs tracking-[0.22em] text-ash">{year}</h2>
              <span className="h-px flex-1 bg-bone/10" aria-hidden="true" />
            </div>
            <div className="mt-5 grid gap-4">
              {posts
                .filter((post) => post.date.startsWith(year))
                .map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
