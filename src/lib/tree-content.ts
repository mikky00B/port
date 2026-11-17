// Adapts the site's real data (projects, MDX posts, socials, now-items) into
// the view models the tree homepage panels render. Server-only: it reads the
// filesystem via the posts lib, so its result is passed down as props.

import { nowItems } from "@/data/now";
import {
  getEarlierProjects,
  getFeaturedProjects,
  type Project,
} from "@/data/projects";
import { socials } from "@/data/socials";
import { formatPostDate } from "@/lib/format";
import { getPostSummaries } from "@/lib/posts";

export type TreeLink = {
  label: string;
  href: string;
  external: boolean;
  download?: boolean;
};

export type TreeProject = {
  name: string;
  hash: string;
  branch: string;
  status: string;
  tags: string[];
  desc: string;
  links: TreeLink[];
};

export type TreePost = {
  title: string;
  date: string;
  read: string;
  tags: string[];
  desc: string;
  href: string;
};

export type TreeSocial = {
  label: string;
  href: string;
  value: string;
  external: boolean;
  download?: boolean;
};

export type TreeProfile = {
  name: string;
  role: string;
  email: string;
  intro: string;
  tagline: string;
  current: string;
};

export type TreeContent = {
  profile: TreeProfile;
  live: TreeProject[];
  archived: TreeProject[];
  posts: TreePost[];
  socials: TreeSocial[];
};

const POST_LIMIT = 5;

// Decorative commit hash — deterministic per slug so it doesn't shift between
// server and client renders.
export function commitHash(seed: string): string {
  let h = 0x811c9dc5; // FNV-1a offset basis
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

function toTreeProject(project: Project): TreeProject {
  const archived = project.status === "Archived";
  const links: TreeLink[] = [];
  if (project.liveUrl) {
    links.push({ label: "live", href: project.liveUrl, external: true });
  }
  if (project.githubUrl) {
    links.push({ label: "github", href: project.githubUrl, external: true });
  }
  if (project.caseStudyUrl) {
    links.push({
      label: "case study",
      href: project.caseStudyUrl,
      external: false,
    });
  }
  return {
    name: project.title,
    hash: commitHash(project.slug),
    branch: `${archived ? "archive" : "feat"}/${project.slug}`,
    status: project.status.toLowerCase(),
    tags: project.category.toLowerCase().split(" / "),
    desc: project.description,
    links,
  };
}

function toTreeSocials(): TreeSocial[] {
  return [
    {
      label: "github",
      href: socials.github,
      value: socials.githubHandle,
      external: true,
    },
    {
      label: "linkedin",
      href: socials.linkedin,
      value: socials.linkedin
        .replace(/^https?:\/\/(www\.)?linkedin\.com\//, "")
        .replace(/\/$/, ""),
      external: true,
    },
    {
      label: "twitter / x",
      href: socials.twitter,
      value: `@${socials.twitter
        .replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//, "")
        .replace(/\/$/, "")}`,
      external: true,
    },
    {
      label: "email",
      href: `mailto:${socials.email}`,
      value: socials.email,
      external: false,
    },
    {
      label: "resume",
      href: socials.resume,
      value: socials.resumeFile,
      external: false,
      download: true,
    },
  ];
}

export function getTreeContent(): TreeContent {
  // Featured order first, then the earlier work — partitioned by status so
  // each panel section stays honest about what is live vs archived.
  const ordered = [...getFeaturedProjects(), ...getEarlierProjects()];

  const currentBuilding = nowItems.find(
    (item) => item.title === "Currently Building"
  );

  return {
    profile: {
      name: socials.name,
      role: socials.identity,
      email: socials.email,
      intro: "python & go",
      tagline:
        "focused on backend systems, infrastructure and developer tools. i build reliable software that solves practical engineering problems.",
      current: currentBuilding?.items[0] ?? "plenty of things at once",
    },
    live: ordered.filter((p) => p.status !== "Archived").map(toTreeProject),
    archived: ordered.filter((p) => p.status === "Archived").map(toTreeProject),
    posts: getPostSummaries().slice(0, POST_LIMIT).map((post) => ({
      title: post.title,
      date: formatPostDate(post.date),
      read: `${post.readingTime} min`,
      tags: post.tags,
      desc: post.description,
      href: `/blog/${post.slug}`,
    })),
    socials: toTreeSocials(),
  };
}
