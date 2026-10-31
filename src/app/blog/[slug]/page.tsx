import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/blog/mdx";
import { PostLayout } from "@/components/blog/PostLayout";
import { getProject } from "@/data/projects";
import { getAdjacentPosts, getAllPosts, getPost, getSeries } from "@/lib/posts";

type PostRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
      types: {
        "application/rss+xml": "/rss.xml"
      }
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags
    },
    robots: post.draft ? { index: false, follow: false } : undefined
  };
}

const mdxOptions: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["anchor"],
            ariaHidden: true,
            tabIndex: -1
          },
          content: { type: "text", value: "#" }
        }
      ],
      [
        rehypePrettyCode,
        {
          theme: "github-dark-dimmed",
          keepBackground: false,
          defaultLang: "plaintext"
        }
      ]
    ]
  }
};

export default async function BlogPostPage({ params }: PostRouteProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const { newer, older } = getAdjacentPosts(post.slug);
  const relatedProject = post.project ? getProject(post.project) : undefined;
  const series = post.series ? getSeries(post.series) : undefined;

  return (
    <PostLayout post={post} newer={newer} older={older} relatedProject={relatedProject} series={series}>
      <MDXRemote source={post.content} components={mdxComponents} options={mdxOptions} />
    </PostLayout>
  );
}
