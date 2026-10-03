export type NowItem = {
  title: string;
  items: string[];
};

export const nowItems: NowItem[] = [
  {
    title: "Currently Building",
    items: ["WATCHDOG alert improvements"]
  },
  {
    title: "Currently Learning",
    items: ["Go backend development", "API gateway architecture"]
  },
  {
    title: "Current Focus",
    items: ["Backend systems", "Monitoring platforms", "Developer tools"]
  },
  {
    title: "Recent Wins",
    items: [
      "Shipped DeployDock, a self-hosted deployment control panel",
      "Launched Swindle, a chess storytelling app",
      "Released Gatekeeper, a self-hosted API gateway"
    ]
  },
  {
    title: "Next Goals",
    items: ["Publish deeper project case studies", "Build a standalone blog app"]
  }
];
