import { describe, expect, it } from "vitest";
import { commitHash, getTreeContent } from "./tree-content";

describe("commitHash", () => {
  it("returns a stable 7-char hex string per slug", () => {
    expect(commitHash("deploydock")).toMatch(/^[0-9a-f]{7}$/);
    expect(commitHash("deploydock")).toBe(commitHash("deploydock"));
    expect(commitHash("watchdog")).not.toBe(commitHash("deploydock"));
  });
});

describe("getTreeContent", () => {
  const content = getTreeContent();

  it("partitions projects into live and archived by status", () => {
    expect(content.live.map((p) => p.name)).toEqual([
      "DeployDock",
      "WATCHDOG",
      "Gatekeeper",
      "Swindle"
    ]);
    expect(content.archived.map((p) => p.name)).toEqual([
      "Chess-Arena",
      "CScan",
      "Production URL Shortener"
    ]);
    expect(content.live.every((p) => p.branch.startsWith("feat/"))).toBe(true);
    expect(content.archived.every((p) => p.branch.startsWith("archive/"))).toBe(true);
  });

  it("keeps internal case-study links on-site", () => {
    const deploydock = content.live.find((p) => p.name === "DeployDock");
    expect(deploydock).toBeDefined();
    const caseStudy = deploydock?.links.find((l) => l.label === "case study");
    expect(caseStudy?.href).toBe("/projects/deploydock");
    expect(caseStudy?.external).toBe(false);
  });

  it("maps recent posts to blog hrefs", () => {
    expect(content.posts.length).toBeGreaterThan(0);
    expect(content.posts.length).toBeLessThanOrEqual(5);
    for (const post of content.posts) {
      expect(post.href).toMatch(/^\/blog\/[a-z0-9-]+$/);
      expect(post.read).toMatch(/^\d+ min$/);
    }
  });

  it("derives social display values from the socials data", () => {
    const github = content.socials.find((s) => s.label === "github");
    expect(github?.value).toBe("mikky00B");
    const linkedin = content.socials.find((s) => s.label === "linkedin");
    expect(linkedin?.value).toBe("in/clevermike02");
    const twitter = content.socials.find((s) => s.label === "twitter / x");
    expect(twitter?.value).toBe("@Clever00__");
  });

  it("uses the current now-item as the building status", () => {
    expect(content.profile.current).toBe("WATCHDOG alert improvements");
  });
});
