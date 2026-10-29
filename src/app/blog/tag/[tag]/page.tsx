import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getAllTags, getPostsByTag } from "@/lib/posts";

type TagRouteProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: TagRouteProps): Promise<Metadata> {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) {
    return {};
  }

  return {
    title: `Posts tagged #${tag}`,
    description: `${posts.length} ${posts.length === 1 ? "post" : "posts"} tagged #${tag}.`,
    alternates: {
      canonical: `/blog/tag/${tag}`,
      types: {
        "application/rss+xml": "/rss.xml"
      }
    }
  };
}

export default async function BlogTagPage({ params }: TagRouteProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  const allTags = getAllTags();

  return (
    <Container className="py-16">
      <Link
        className="focus-ring inline-flex items-center gap-2 rounded font-mono text-xs uppercase tracking-[0.18em] text-dim transition hover:text-text"
        href="/blog"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All posts
      </Link>

      <div className="mt-8">
        <SectionHeader
          eyebrow="Tag"
          title={`#${tag}`}
          description={`${posts.length} ${posts.length === 1 ? "post" : "posts"} under this tag.`}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {allTags.map((entry) => (
          <Link
            key={entry.tag}
            className={
              entry.tag === tag
                ? "focus-ring rounded border border-accent px-2.5 py-1 font-mono text-xs text-text"
                : "focus-ring rounded border border-line px-2.5 py-1 font-mono text-xs text-dim transition hover:border-accent hover:text-text"
            }
            href={`/blog/tag/${entry.tag}`}
          >
            #{entry.tag} {entry.count}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
