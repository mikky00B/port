export type ProjectStatus = "Live" | "In Progress" | "Archived";

export type Project = {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  stack: string[];
  challenge: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl: string;
  featured: boolean;
  summary: string;
  focus: string;
  architecture: string[];
  features: string[];
  lessons: string[];
};

export const projects: Project[] = [
  {
    slug: "chess-arena",
    title: "Chess-Arena",
    description:
      "A chess platform first, with optional competitive and Web3 modes layered onto the core realtime game experience.",
    category: "Web3 / Backend / Realtime",
    status: "In Progress",
    stack: ["FastAPI", "React", "Redis", "Vyper", "chess.js", "react-chessboard"],
    challenge:
      "Combining smart contract escrow, backend signing, game state, and delayed payout logic.",
    githubUrl: "https://github.com/mikky00B",
    caseStudyUrl: "/projects/chess-arena",
    featured: false,
    summary:
      "Chess-Arena explores realtime game state, Web3 escrow flows, and clean separation between gameplay and competitive payout logic.",
    focus: "Realtime backend, Web3 coordination, game state",
    architecture: [
      "Player Client",
      "React Chessboard",
      "FastAPI Game API",
      "Redis Game State",
      "Escrow Contract",
      "Payout Worker"
    ],
    features: [
      "Realtime chess game flow",
      "Optional Web3 competitive mode",
      "Backend-signed game outcomes",
      "Delayed payout and dispute-aware logic"
    ],
    lessons: [
      "Gameplay should remain useful even without Web3 features enabled.",
      "Escrow systems need explicit state transitions.",
      "Realtime applications benefit from narrow backend contracts."
    ]
  },
  {
    slug: "gatekeeper",
    title: "Gatekeeper",
    description:
      "A self-hosted API gateway in Go with config-driven reverse proxy routing, load balancing, auth, rate limiting, observability, and admin tooling.",
    category: "Backend / API Gateway / Infrastructure",
    status: "Live",
    stack: ["Go", "Redis", "JWT", "TLS", "Reverse Proxy"],
    challenge:
      "Building a gateway that keeps routing, upstream health, authentication, rate limits, analytics, and config reloads predictable under one operational surface.",
    githubUrl: "https://github.com/mikky00B/Gatekeeper",
    caseStudyUrl: "/projects/gatekeeper",
    featured: false,
    summary:
      "Gatekeeper is a self-hosted API gateway written in Go, designed around config-driven reverse proxy routes, multiple upstreams, round-robin load balancing, optional health checks, API key and JWT authentication, rate limiting, logging, analytics, TLS, an admin API, a static dashboard, and CLI helpers.",
    focus: "API gateway design, proxying, traffic control",
    architecture: [
      "Client Request",
      "Gatekeeper Router",
      "Authentication Layer",
      "Rate Limiter",
      "Load Balancer",
      "Upstream Services",
      "Admin API / Dashboard"
    ],
    features: [
      "Config-driven reverse proxy routing",
      "Multiple upstreams per route with round-robin balancing",
      "Optional upstream health checks",
      "API key authentication and optional HS256 JWT verification",
      "In-memory or Redis-backed rate limiting",
      "Request logging, route analytics, hot config reload, TLS, dashboard, and CLI helpers"
    ],
    lessons: [
      "Gateway behavior needs clear config boundaries and predictable reload semantics.",
      "Traffic control features work best when authentication, rate limits, and upstream health share a simple request flow.",
      "Operational APIs need visibility through logs, analytics, and a dashboard, not just proxy behavior."
    ]
  },
  {
    slug: "watchdog",
    title: "WATCHDOG",
    description:
      "A monitoring platform for uptime checks, API health checks, cron-job heartbeats, incidents, and alerts.",
    category: "Monitoring / Backend / SaaS",
    status: "Live",
    stack: ["FastAPI", "React"],
    challenge: "Designing async checks, scheduler workers, incident tracking, and alert delivery.",
    liveUrl: "https://watchdog.clevermike.studio",
    githubUrl: "https://github.com/mikky00B",
    caseStudyUrl: "/projects/watchdog",
    featured: true,
    summary:
      "WATCHDOG is an uptime, API, and cron-job monitoring platform for small agencies and backend teams, with alerting, check history, incidents, and branded status pages.",
    focus: "Backend architecture, monitoring, alerting",
    architecture: [
      "User Dashboard",
      "FastAPI Backend",
      "Monitor Scheduler",
      "Checker Service",
      "Check Results / Incidents",
      "Alert Service",
      "Email / Telegram / WhatsApp"
    ],
    features: [
      "Uptime and API endpoint checks",
      "Cron-job heartbeat tracking",
      "Incident history and status pages",
      "Alert delivery workflow"
    ],
    lessons: [
      "Reliable monitoring depends on careful background scheduling.",
      "Incident state needs a clear model, not just raw check logs.",
      "Operational tools work best when status is visible at a glance."
    ]
  },
  {
    slug: "token-approval-scanner",
    title: "Token Approval Scanner",
    description:
      "A tool that helps users inspect active token approvals and revoke risky allowances.",
    category: "Web3 / Security Tool",
    status: "Archived",
    stack: ["React", "Ethers", "Blockchain RPC APIs"],
    challenge: "Reading wallet allowances and creating a clean interface for safer Web3 usage.",
    githubUrl: "https://github.com/mikky00B",
    caseStudyUrl: "/projects/token-approval-scanner",
    featured: false,
    summary:
      "A security-focused Web3 utility for making token approvals easier to inspect and reason about.",
    focus: "Wallet safety, chain reads, frontend clarity",
    architecture: ["Wallet", "React UI", "RPC Provider", "Token Contracts", "Approval Table"],
    features: ["Wallet approval lookup", "Risky allowance highlighting", "Revoke flow concept"],
    lessons: [
      "Security tools need plain language.",
      "RPC reads should be batched where possible.",
      "Wallet UX needs careful error states."
    ]
  },
  {
    slug: "url-shortener",
    title: "Production URL Shortener",
    description:
      "A production-style URL shortener with custom slugs, expiry, QR codes, password protection, and analytics.",
    category: "Backend / System Design / Analytics",
    status: "In Progress",
    stack: ["FastAPI", "PostgreSQL", "Redis", "React", "Tailwind CSS"],
    challenge: "Optimizing redirect speed, click ingestion, Redis caching, and analytics rollups.",
    githubUrl: "https://github.com/mikky00B",
    caseStudyUrl: "/projects/url-shortener",
    featured: false,
    summary:
      "A URL shortener built as a system design exercise, focused on fast redirects, analytics capture, custom links, and operational safety.",
    focus: "API performance, analytics, caching",
    architecture: [
      "Public Redirect",
      "FastAPI Router",
      "Redis Cache",
      "PostgreSQL Links",
      "Click Ingestion",
      "Analytics Rollups"
    ],
    features: [
      "Custom slugs and link expiry",
      "Password-protected links",
      "QR code generation",
      "Click analytics and rollups"
    ],
    lessons: [
      "Redirect paths should stay small and cache-friendly.",
      "Analytics ingestion should not slow down user navigation.",
      "Production-style features create useful edge cases quickly."
    ]
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
