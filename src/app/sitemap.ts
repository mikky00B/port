import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getAllPosts, getAllTags } from "@/lib/posts";

const SITE = "https://clevermike.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/blog", "/contact", "/lab", "/now", "/resume"].map((route) => ({
    url: `${SITE}${route}`,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.6
  }));

  const caseStudies = projects
    .filter((project) => project.caseStudyUrl)
    .map((project) => ({
      url: `${SITE}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7
    }));

  const posts = getAllPosts().map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.8
  }));

  const tags = getAllTags().map(({ tag }) => ({
    url: `${SITE}/blog/tag/${tag}`,
    changeFrequency: "yearly" as const,
    priority: 0.4
  }));

  return [...staticRoutes, ...caseStudies, ...posts, ...tags];
}
