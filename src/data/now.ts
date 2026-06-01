export type NowItem = {
  title: string;
  items: string[];
};

export const nowItems: NowItem[] = [
  {
    title: "Currently Building",
    items: ["Personal developer command center", "Go reverse proxy / API gateway", "WATCHDOG alert improvements"]
  },
  {
    title: "Currently Learning",
    items: ["Go backend development", "API gateway architecture", "Advanced React/Tailwind UI patterns"]
  },
  {
    title: "Current Focus",
    items: ["Backend systems", "Monitoring platforms", "Developer tools", "Standalone blog app planning"]
  },
  {
    title: "Recent Wins",
    items: ["Shipped monitoring project foundations", "Built several backend/fullstack project demos", "Expanded Web3 contract experiments"]
  },
  {
    title: "Next Goals",
    items: ["Publish deeper project case studies", "Improve WATCHDOG alerts", "Build a standalone blog app"]
  }
];
