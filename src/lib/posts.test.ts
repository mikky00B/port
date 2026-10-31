import { afterEach, describe, expect, it, vi } from "vitest";

const fsMocks = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  readFileSync: vi.fn()
}));

vi.mock("node:fs", () => ({ default: fsMocks }));

type FixtureOptions = {
  slug: string;
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  project?: string;
  series?: string;
  seriesOrder?: number;
  draft?: boolean;
  body?: string;
};

function makePost({
  slug,
  title,
  description,
  date = "2026-10-20",
  tags,
  project,
  series,
  seriesOrder,
  draft,
  body = "## Intro\n\nA few words."
}: FixtureOptions): string {
  const front = [
    "---",
    `title: "${title ?? `${slug} title`}"`,
    `description: "${description ?? `${slug} description`}"`,
    `date: ${date}`
  ];
  if (tags) {
    front.push(`tags: [${tags.join(", ")}]`);
  }
  if (project) {
    front.push(`project: ${project}`);
  }
  if (series) {
    front.push(`series: ${series}`);
  }
  if (seriesOrder !== undefined) {
    front.push(`seriesOrder: ${seriesOrder}`);
  }
  if (draft !== undefined) {
    front.push(`draft: ${draft}`);
  }
  front.push("---");

  return [...front, "", body, ""].join("\n");
}

function installPosts(files: Record<string, string>) {
  fsMocks.existsSync.mockReturnValue(true);
  fsMocks.readdirSync.mockReturnValue(Object.keys(files));
  fsMocks.readFileSync.mockImplementation((filePath: string) => {
    const name = String(filePath).split(/[\\/]/).pop() ?? "";
    if (name in files) {
      return files[name];
    }
    throw new Error(`unexpected read: ${String(filePath)}`);
  });
}

async function loadPostsModule() {
  vi.resetModules();
  return import("@/lib/posts");
}

afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllEnvs();
});

describe("getAllPosts", () => {
  it("returns an empty list when the posts directory is missing", async () => {
    fsMocks.existsSync.mockReturnValue(false);
    const { getAllPosts } = await loadPostsModule();

    expect(getAllPosts()).toEqual([]);
  });

  it("hides drafts in production and shows them in development", async () => {
    installPosts({
      "published.mdx": makePost({ slug: "published", date: "2026-10-01" }),
      "secret.mdx": makePost({ slug: "secret", date: "2026-10-02", draft: true })
    });

    const { getAllPosts } = await loadPostsModule();
    expect(getAllPosts().map((post) => post.slug)).toEqual(["published"]);

    vi.stubEnv("NODE_ENV", "development");
    const devModule = await loadPostsModule();
    expect(devModule.getAllPosts().map((post) => post.slug)).toEqual(["secret", "published"]);
  });

  it("sorts posts newest first", async () => {
    installPosts({
      "old.mdx": makePost({ slug: "old", date: "2025-06-15" }),
      "newest.mdx": makePost({ slug: "newest", date: "2026-10-20" }),
      "middle.mdx": makePost({ slug: "middle", date: "2026-01-01" })
    });
    const { getAllPosts } = await loadPostsModule();

    expect(getAllPosts().map((post) => post.slug)).toEqual(["newest", "middle", "old"]);
  });

  it("normalizes frontmatter dates to ISO yyyy-mm-dd", async () => {
    installPosts({ "dated.mdx": makePost({ slug: "dated", date: "2026-10-20T12:00:00Z" }) });
    const { getPost } = await loadPostsModule();

    expect(getPost("dated")?.date).toBe("2026-10-20");
  });

  it("rejects an empty title with a file-scoped error", async () => {
    installPosts({ "bad.mdx": makePost({ slug: "bad", title: "" }) });
    const { getAllPosts } = await loadPostsModule();

    expect(() => getAllPosts()).toThrow('[blog] content/posts/bad.mdx: "title" must be a non-empty string');
  });

  it("normalizes tag case and rejects tags that are not kebab-case", async () => {
    installPosts({ "bad-tag.mdx": makePost({ slug: "bad-tag", tags: ["Go", "Backend_Tips"] }) });
    const { getAllPosts } = await loadPostsModule();

    expect(() => getAllPosts()).toThrow('tag "backend_tips" must be lowercase kebab-case');
  });

  it("normalizes uppercase tags to lowercase", async () => {
    installPosts({ "tagged.mdx": makePost({ slug: "tagged", tags: ["Go"] }) });
    const { getPost } = await loadPostsModule();

    expect(getPost("tagged")?.tags).toEqual(["go"]);
  });

  it("rejects unknown project slugs", async () => {
    installPosts({ "bad-project.mdx": makePost({ slug: "bad-project", project: "not-a-project" }) });
    const { getAllPosts } = await loadPostsModule();

    expect(() => getAllPosts()).toThrow(
      '[blog] content/posts/bad-project.mdx: "project" refers to unknown project "not-a-project"'
    );
  });

  it("rejects filenames that are not lowercase kebab-case", async () => {
    installPosts({ "Bad_Slug.mdx": makePost({ slug: "bad-slug" }) });
    const { getAllPosts } = await loadPostsModule();

    expect(() => getAllPosts()).toThrow("[blog] content/posts/Bad_Slug.mdx: filename must be lowercase kebab-case");
  });
});

describe("table of contents", () => {
  it("mirrors rehype-slug ids, skips fences, and excludes h1", async () => {
    const body = [
      "# Standalone title",
      "",
      "## Setup",
      "",
      "### Prerequisites",
      "",
      "## Setup",
      "",
      "```bash",
      "# not a heading",
      "echo done",
      "```"
    ].join("\n");

    installPosts({ "toc.mdx": makePost({ slug: "toc", body }) });
    const { getPost } = await loadPostsModule();

    expect(getPost("toc")?.toc).toEqual([
      { id: "setup", text: "Setup", depth: 2 },
      { id: "prerequisites", text: "Prerequisites", depth: 3 },
      { id: "setup-1", text: "Setup", depth: 2 }
    ]);
  });
});

describe("reading time", () => {
  it("counts prose words only and ignores code fences", async () => {
    const prose = "lorem ipsum dolor sit amet ".repeat(40);
    const body = ["## Heading", "", prose.trim(), "", "```bash", "code ".repeat(500), "```"].join("\n");

    installPosts({ "timed.mdx": makePost({ slug: "timed", body }) });
    const { getPost } = await loadPostsModule();

    expect(getPost("timed")?.readingTime).toBe(1);
  });
});

describe("getAdjacentPosts", () => {
  it("returns newer and older neighbours relative to the sorted list", async () => {
    installPosts({
      "a.mdx": makePost({ slug: "a", date: "2026-01-01" }),
      "b.mdx": makePost({ slug: "b", date: "2026-02-01" }),
      "c.mdx": makePost({ slug: "c", date: "2026-03-01" })
    });
    const { getAdjacentPosts } = await loadPostsModule();

    expect(getAdjacentPosts("b")).toEqual({
      newer: expect.objectContaining({ slug: "c" }),
      older: expect.objectContaining({ slug: "a" })
    });
    expect(getAdjacentPosts("c").newer).toBeUndefined();
    expect(getAdjacentPosts("a").older).toBeUndefined();
  });

  it("returns empty neighbours for unknown slugs", async () => {
    installPosts({ "a.mdx": makePost({ slug: "a" }) });
    const { getAdjacentPosts } = await loadPostsModule();

    expect(getAdjacentPosts("nope")).toEqual({ newer: undefined, older: undefined });
  });
});

describe("series", () => {
  const seriesPost = (slug: string, order: number, date = "2026-10-30") =>
    makePost({ slug, date, series: "Inside Termii", seriesOrder: order });

  it("orders same-date posts by part and exposes series metadata", async () => {
    installPosts({
      "p3.mdx": seriesPost("p3", 3),
      "p1.mdx": seriesPost("p1", 1),
      "p2.mdx": seriesPost("p2", 2)
    });
    const { getAllPosts, getPostSummaries, getSeries } = await loadPostsModule();

    expect(getAllPosts().map((post) => post.slug)).toEqual(["p1", "p2", "p3"]);
    const [summary] = getPostSummaries();
    expect(summary).toMatchObject({ series: "Inside Termii", seriesOrder: 1 });

    const series = getSeries("Inside Termii");
    expect(series?.name).toBe("Inside Termii");
    expect(series?.parts.map((part) => part.slug)).toEqual(["p1", "p2", "p3"]);
    expect(getSeries("No Such Series")).toBeUndefined();
  });

  it("rejects series metadata that is incomplete or malformed", async () => {
    installPosts({ "lonely.mdx": makePost({ slug: "lonely", series: "Inside Termii" }) });
    const { getAllPosts } = await loadPostsModule();

    expect(() => getAllPosts()).toThrow(
      '[blog] content/posts/lonely.mdx: "series" and "seriesOrder" must be set together'
    );

    installPosts({
      "zero.mdx": makePost({ slug: "zero", series: "Inside Termii", seriesOrder: 0 })
    });
    const reloaded = await loadPostsModule();
    expect(() => reloaded.getAllPosts()).toThrow(
      '[blog] content/posts/zero.mdx: "seriesOrder" must be a positive integer'
    );
  });
});

describe("summaries, tags and projects", () => {
  it("returns summaries without content or toc and resolves the project link", async () => {
    installPosts({
      "with-project.mdx": makePost({ slug: "with-project", tags: ["go"], project: "deploydock" })
    });
    const { getPostSummaries, getPostsForProject } = await loadPostsModule();

    const [summary] = getPostSummaries();
    expect(summary).toMatchObject({
      slug: "with-project",
      title: "with-project title",
      description: "with-project description",
      date: "2026-10-20",
      tags: ["go"],
      project: "deploydock",
      draft: false
    });
    expect(summary).not.toHaveProperty("content");
    expect(summary).not.toHaveProperty("toc");
    expect(getPostsForProject("deploydock").map((post) => post.slug)).toEqual(["with-project"]);
  });

  it("counts tags across posts, most used first", async () => {
    installPosts({
      "one.mdx": makePost({ slug: "one", tags: ["go", "deployments"] }),
      "two.mdx": makePost({ slug: "two", tags: ["go"] })
    });
    const { getAllTags, getPostsByTag } = await loadPostsModule();

    expect(getAllTags()).toEqual([
      { tag: "go", count: 2 },
      { tag: "deployments", count: 1 }
    ]);
    expect(getPostsByTag("go").map((post) => post.slug)).toEqual(["one", "two"]);
    expect(getPostsByTag("missing")).toEqual([]);
  });
});
