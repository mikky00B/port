import { describe, expect, it } from "vitest";
import { getEarlierProjects, getFeaturedProjects } from "./projects";

describe("project selection", () => {
  it("leads with DeployDock, WATCHDOG, Gatekeeper, and Swindle", () => {
    expect(getFeaturedProjects().map((project) => project.slug)).toEqual([
      "deploydock",
      "watchdog",
      "gatekeeper",
      "swindle"
    ]);
  });

  it("keeps archived work in the earlier list", () => {
    expect(getEarlierProjects().map((project) => project.slug)).toEqual([
      "chess-arena",
      "token-approval-scanner",
      "url-shortener"
    ]);
    expect(getEarlierProjects().every((project) => project.featured === false)).toBe(true);
  });
});
