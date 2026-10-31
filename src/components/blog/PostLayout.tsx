import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { formatPostDate } from "@/lib/format";
import type { Post, PostSummary, SeriesInfo } from "@/lib/posts";
import type { Project } from "@/data/projects";

type PostLayoutProps = {
  post: Post;
  newer?: PostSummary;
  older?: PostSummary;
  relatedProject?: Project;
  series?: SeriesInfo;
  children: React.ReactNode;
};

export function PostLayout({ post, newer, older, relatedProject, series, children }: PostLayoutProps) {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          className="focus-ring inline-flex items-center gap-2 rounded font-mono text-xs uppercase tracking-[0.18em] text-dim transition hover:text-text"
          href="/blog"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All posts
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_200px]">
          <div className="min-w-0">
            <header>
              {post.tags.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <Link
                        className="focus-ring rounded border border-line px-2 py-1 font-mono text-xs text-dim transition hover:border-accent hover:text-text"
                        href={`/blog/tag/${tag}`}
                      >
                        #{tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}

              <h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-text sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{post.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-dim">
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span aria-hidden="true">/</span>
                <span>{post.readingTime} min read</span>
                {post.draft ? (
                  <span className="rounded border border-line px-1.5 py-0.5 text-warning">draft</span>
                ) : null}
              </div>
            </header>

            {series ? (
              <nav
                className="mt-8 rounded-lg border border-line bg-panel/60 p-5"
                aria-label={`Series: ${series.name}`}
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{series.name}</p>
                <ol className="mt-3 space-y-2">
                  {series.parts.map((part, index) => (
                    <li key={part.slug} className="font-mono text-sm leading-6">
                      {part.slug === post.slug ? (
                        <span className="text-text">
                          Part {index + 1}: {part.title}
                        </span>
                      ) : (
                        <Link className="text-dim transition hover:text-text" href={`/blog/${part.slug}`}>
                          Part {index + 1}: {part.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            <article className="prose-dev mt-10">{children}</article>

            {relatedProject ? (
              <Card className="mt-14">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">Related project</p>
                <h2 className="mt-3 font-heading text-xl font-semibold text-text">{relatedProject.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{relatedProject.description}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {relatedProject.caseStudyUrl ? (
                    <Button href={relatedProject.caseStudyUrl} variant="secondary">
                      Read the case study
                    </Button>
                  ) : null}
                  {relatedProject.liveUrl ? (
                    <Button href={relatedProject.liveUrl} variant="ghost">
                      Live site ↗
                    </Button>
                  ) : null}
                </div>
              </Card>
            ) : null}

            {older || newer ? (
              <nav className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2" aria-label="More posts">
                {older ? (
                  <Link
                    className="focus-ring rounded-lg border border-line bg-panel/60 p-4 transition hover:border-accent"
                    href={`/blog/${older.slug}`}
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-dim">Older</span>
                    <span className="mt-2 block font-heading text-base font-semibold text-text">{older.title}</span>
                  </Link>
                ) : (
                  <span className="hidden sm:block" />
                )}
                {newer ? (
                  <Link
                    className="focus-ring rounded-lg border border-line bg-panel/60 p-4 transition hover:border-accent sm:text-right"
                    href={`/blog/${newer.slug}`}
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-dim">Newer</span>
                    <span className="mt-2 block font-heading text-base font-semibold text-text">{newer.title}</span>
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <TableOfContents items={post.toc} />
          </aside>
        </div>
      </div>
    </Container>
  );
}
