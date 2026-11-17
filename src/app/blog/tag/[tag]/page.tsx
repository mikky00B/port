import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/ui/Container";
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
        className="focus-ring inline-flex items-center gap-2 rounded font-mono text-xs tracking-[0.14em] text-ash transition hover:text-gilt"
        href="/blog"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        cd /blog
      </Link>

      <div className="mt-8 max-w-2xl">
        <p className="font-mono text-xs tracking-[0.14em] text-gilt">$ git log --tag #{tag}</p>
        <h1 className="mt-3 text-3xl font-medium tracking-wide text-glint sm:text-4xl">#{tag}</h1>
        <p className="mt-4 text-[15px] leading-7 text-moss">
          {posts.length} {posts.length === 1 ? "post" : "posts"} under this tag.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {allTags.map((entry) => (
          <Link
            key={entry.tag}
            className={
              entry.tag === tag
                ? "focus-ring rounded border border-gilt/50 bg-gilt/10 px-2.5 py-1 font-mono text-xs text-gilt"
                : "focus-ring rounded border border-bone/[0.12] px-2.5 py-1 font-mono text-xs text-ash transition hover:border-gilt/40 hover:text-gilt"
            }
            href={`/blog/tag/${entry.tag}`}
          >
            #{entry.tag} {entry.count}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
