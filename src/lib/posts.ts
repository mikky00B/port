import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { projects } from "@/data/projects";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const WORDS_PER_MINUTE = 200;
const IS_DEV = process.env.NODE_ENV === "development";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  project?: string;
  series?: string;
  seriesOrder?: number;
  readingTime: number;
};

export type Post = PostSummary & {
  content: string;
  toc: TocItem[];
};

function fail(file: string, message: string): never {
  throw new Error(`[blog] content/posts/${file}: ${message}`);
}

function readString(value: unknown, file: string, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    fail(file, `"${field}" must be a non-empty string`);
  }
  return value.trim();
}

function readDate(value: unknown, file: string): string {
  if (!(value instanceof Date) && typeof value !== "string") {
    fail(file, '"date" must be an ISO date, e.g. 2026-10-20');
  }
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    fail(file, `"date" is not a valid date: ${String(value)}`);
  }
  return parsed.toISOString().slice(0, 10);
}

function readTags(value: unknown, file: string): string[] {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    fail(file, '"tags" must be a list, e.g. [deployments, go]');
  }
  return value.map((entry) => {
    if (typeof entry !== "string") {
      fail(file, '"tags" entries must be strings');
    }
    const tag = entry.trim().toLowerCase();
    if (!TAG_PATTERN.test(tag)) {
      fail(file, `tag "${tag}" must be lowercase kebab-case`);
    }
    return tag;
  });
}

function readProject(value: unknown, file: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string") {
    fail(file, '"project" must be a project slug');
  }
  const slug = value.trim();
  if (!projects.some((project) => project.slug === slug)) {
    fail(file, `"project" refers to unknown project "${slug}"`);
  }
  return slug;
}

function readSeries(value: unknown, file: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string" || value.trim() === "") {
    fail(file, '"series" must be a non-empty string');
  }
  return value.trim();
}

function readSeriesOrder(value: unknown, file: string): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    fail(file, '"seriesOrder" must be a positive integer');
  }
  return value;
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_~]{1,2}([^*_~]+)[*_~]{1,2}/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function buildToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  let inFence = false;

  for (const line of content.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }

    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) {
      continue;
    }

    const depth = match[1].length;
    const text = stripInlineMarkdown(match[2]);
    if (text === "") {
      continue;
    }

    // feed every heading to the slugger so ids match rehype-slug exactly
    const id = slugger.slug(text);
    if (depth >= 2) {
      toc.push({ id, text, depth: depth as 2 | 3 });
    }
  }

  return toc;
}

function readingTime(content: string): number {
  const prose = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~\-]+/g, " ");
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function readPostFile(file: string): Post {
  const slug = path.basename(file, ".mdx");
  if (!SLUG_PATTERN.test(slug)) {
    fail(file, "filename must be lowercase kebab-case");
  }

  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  const draft = data.draft === true;
  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    fail(file, '"draft" must be true or false');
  }

  const series = readSeries(data.series, file);
  const seriesOrder = readSeriesOrder(data.seriesOrder, file);
  if ((series === undefined) !== (seriesOrder === undefined)) {
    fail(file, '"series" and "seriesOrder" must be set together');
  }

  return {
    slug,
    title: readString(data.title, file, "title"),
    description: readString(data.description, file, "description"),
    date: readDate(data.date, file),
    tags: readTags(data.tags, file),
    draft,
    project: readProject(data.project, file),
    series,
    seriesOrder,
    readingTime: readingTime(content),
    content,
    toc: buildToc(content)
  };
}

let productionCache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (!IS_DEV && productionCache) {
    return productionCache;
  }

  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  const posts = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(readPostFile)
    .filter((post) => IS_DEV || !post.draft)
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0) ||
        a.slug.localeCompare(b.slug)
    );

  if (!IS_DEV) {
    productionCache = posts;
  }

  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

function toSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    draft: post.draft,
    project: post.project,
    series: post.series,
    seriesOrder: post.seriesOrder,
    readingTime: post.readingTime
  };
}

export function getPostSummaries(): PostSummary[] {
  return getAllPosts().map(toSummary);
}

export function getAdjacentPosts(slug: string): {
  newer: PostSummary | undefined;
  older: PostSummary | undefined;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return { newer: undefined, older: undefined };
  }
  return {
    newer: index > 0 ? toSummary(posts[index - 1]) : undefined,
    older: index < posts.length - 1 ? toSummary(posts[index + 1]) : undefined
  };
}

export function getAllTags(): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getPostsForProject(projectSlug: string): PostSummary[] {
  return getPostSummaries().filter((post) => post.project === projectSlug);
}

export type SeriesInfo = {
  name: string;
  parts: PostSummary[];
};

export function getSeries(name: string): SeriesInfo | undefined {
  const parts = getAllPosts()
    .filter((post) => post.series === name)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
    .map(toSummary);

  return parts.length > 0 ? { name, parts } : undefined;
}
