import { getAllPosts } from "@/lib/posts";

const SITE = "https://clevermike.studio";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();
  const updated = posts[0]?.date ?? new Date().toISOString().slice(0, 10);

  const items = posts
    .map((post) => {
      const url = `${SITE}/blog/${post.slug}`;
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(post.description)}</description>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        "    </item>"
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Michael Abulude - Blog</title>",
    `    <link>${SITE}/blog</link>`,
    "    <description>Notes on deployment systems, monitoring, Go, and backend architecture.</description>",
    "    <language>en</language>",
    `    <lastBuildDate>${new Date(`${updated}T00:00:00Z`).toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
    ""
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
