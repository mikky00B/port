import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "I write down what I learn while building, deploying, and occasionally breaking real systems — so you can skip the expensive mistakes.",
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
      <SectionHeader
        eyebrow="Blog"
        title="Backend engineering, learned in public."
        description="I write down what I learn while building, deploying, and occasionally breaking real systems — so you can skip the expensive mistakes."
      />

      {tags.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            className="focus-ring rounded border border-accent px-2.5 py-1 font-mono text-xs text-text"
            href="/blog"
          >
            all {posts.length}
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag.tag}
              className="focus-ring rounded border border-line px-2.5 py-1 font-mono text-xs text-dim transition hover:border-accent hover:text-text"
              href={`/blog/tag/${tag.tag}`}
            >
              #{tag.tag} {tag.count}
            </Link>
          ))}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <p className="mt-12 text-muted">No posts published yet.</p>
      ) : null}

      <div className="mt-12 space-y-12">
        {years.map((year) => (
          <section key={year}>
            <div className="flex items-center gap-4">
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-dim">{year}</h2>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </div>
            <div className="mt-5 grid gap-5">
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
