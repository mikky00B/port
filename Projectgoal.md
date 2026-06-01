# Personal Developer Website — Build README

## 1. Project Overview

This project is a personal developer website for **Michael Abulude**, a backend-focused fullstack developer. The website should function as a polished portfolio, technical blog, project case-study hub, resume page, and personal developer command center.

The site should not feel like a generic portfolio. It should feel like a modern developer dashboard that communicates technical depth, practical project experience, and active engineering growth.

### Core Identity

Michael is a backend-focused fullstack developer who builds practical web systems, APIs, monitoring tools, automation systems, and infrastructure-aware products using:

* Python
* FastAPI
* Django
* Go
* React
* Tailwind CSS
* PostgreSQL
* Linux/Nginx deployment
* Web3 tools and smart contracts

### Primary Goal

The website should answer these questions clearly:

1. Who is Michael?
2. What does he build?
3. What projects prove his ability?
4. How does he think technically?
5. How can a recruiter, client, or collaborator contact him?

### Product Direction

Build the site as a:

> Developer command center + technical blog + project case-study platform.

The visual experience should feel technical, polished, fast, and trustworthy.

---

## 2. Recommended Tech Stack

### Frontend

Use:

* **Next.js**
* **TypeScript**
* **Tailwind CSS**
* **MDX** for blog posts and case studies
* **Framer Motion** for subtle animations
* **Lucide React** for icons

### Optional Backend Later

The first version can be static-first. Later, a FastAPI backend can be added for dynamic features.

Possible backend stack:

* FastAPI
* PostgreSQL
* Redis
* GitHub API integration
* Contact form endpoint
* AI portfolio search/RAG endpoint

### Deployment

Recommended deployment options:

* Vercel for the Next.js frontend
* VPS/Nginx if Michael wants full infrastructure control
* FastAPI backend can be deployed separately on VPS

---

## 3. Design Direction

### Overall Feel

The site should have a dark, premium, dashboard-inspired interface.

Keywords:

* Technical
* Clean
* System-focused
* Backend-oriented
* Dashboard-like
* Fast
* Professional
* Slightly futuristic, but not overdesigned

Avoid a generic agency-style landing page.

### Theme

Use a dark technical theme.

Recommended color palette:

```txt
Background: #0B1120
Card Background: #111827
Secondary Card: #0F172A
Border: #1F2937
Primary Text: #F9FAFB
Secondary Text: #9CA3AF
Muted Text: #6B7280
Accent: #38BDF8
Success: #22C55E
Warning: #F59E0B
Error: #EF4444
```

### Typography

Recommended font combination:

```txt
Headings: Space Grotesk
Body: Inter
Code: JetBrains Mono
```

Use large, clean headings and comfortable paragraph spacing.

### UI Style

Use:

* Rounded cards
* Subtle borders
* Soft shadows
* Slight hover glow
* Status indicators
* Code-inspired details
* Small terminal/dashboard elements
* Clear spacing

Avoid:

* Excessive neon
* Too many animations
* Skill percentage bars
* Overly flashy particles
* Huge empty hero area
* Generic stock illustrations

---

## 4. Site Structure

The website should include the following core routes:

```txt
/
/about
/projects
/projects/watchdog
/projects/chess-arena
/projects/url-shortener
/blog
/blog/[slug]
/now
/resume
/contact
/lab optional
```

### Main Navigation

Desktop navigation:

```txt
Home
Projects
Blog
Now
Resume
Contact
```

Optional:

```txt
Lab
```

The navigation should be sticky, minimal, and clean.

Navbar requirements:

* Sticky top
* Dark translucent background
* Backdrop blur
* Thin bottom border
* Active page indicator
* Mobile hamburger menu
* Logo text: `clevermike.studio` or `Michael Abulude`

---

## 5. Homepage Requirements

The homepage should tell a clear story:

```txt
Who I am → What I build → Proof through projects → How I think → What I am building now → Contact
```

### Homepage Sections

1. Hero section
2. Featured project section
3. Projects preview
4. Technical stack section
5. Latest blog posts
6. Now building section
7. Optional GitHub activity/status section
8. Contact CTA

---

## 6. Hero Section

### Purpose

The hero should immediately explain Michael’s identity and value.

### Hero Copy

Use this as the base copy:

```txt
Michael Abulude
Backend-Focused Fullstack Developer

I build scalable APIs, monitoring tools, automation systems, and practical web products using Python, FastAPI, Django, Go, React, and PostgreSQL.
```

### CTA Buttons

Primary button:

```txt
View Projects
```

Secondary button:

```txt
Read Blog
```

Optional third button:

```txt
Download Resume
```

### Hero Status Badge

Add a small badge:

```txt
Available for backend roles and freelance projects
```

### Hero Visual

Instead of a random image, create a dashboard-style hero card.

Hero visual card content:

```txt
System Snapshot
Portfolio: Online
WATCHDOG: Online
Main Stack: FastAPI / Django / React / Go
Current Build: Personal Dev Command Center
```

Use status dots:

* Green for online
* Blue/cyan for active build
* Gray for metadata

---

## 7. Featured Project Section

The first featured project should be **WATCHDOG**.

### WATCHDOG Description

```txt
WATCHDOG is an uptime, API, and cron-job monitoring platform for small agencies and backend teams, with alerting, check history, incidents, and branded status pages.
```

### Display Details

Show:

* Project name
* Short description
* Stack badges
* Status badge
* Main engineering challenge
* CTA to case study
* CTA to live site
* CTA to GitHub

Example:

```txt
WATCHDOG
Uptime, API, and cron-job monitoring platform for small teams.

Stack: FastAPI · PostgreSQL · React · Nginx
Status: Live
Challenge: Async checks, incident tracking, alert delivery, scheduler workers

[View Case Study] [Live Demo] [GitHub]
```

---

## 8. Projects Page

The projects page should show selected projects as high-quality cards.

### Project Card Requirements

Each project card should include:

* Project name
* Short description
* Tech stack
* Status
* Category
* Engineering challenge
* Live link if available
* GitHub link if available
* Case study link

### Suggested Projects

#### 1. WATCHDOG

Category:

```txt
Monitoring / Backend / SaaS
```

Stack:

```txt
FastAPI, PostgreSQL, React, Nginx, Linux VPS
```

Description:

```txt
A monitoring platform for uptime checks, API health checks, cron-job heartbeats, incidents, and alerts.
```

Engineering challenge:

```txt
Designing async checks, scheduler workers, incident tracking, and alert delivery.
```

#### 2. Chess-Arena

Category:

```txt
Web3 / Backend / Realtime
```

Stack:

```txt
FastAPI, React, Redis, Vyper, chess.js, react-chessboard 
```

Description:

```txt
A chess platform first, with optional competitive and Web3 modes layered on to
```

Engineering challenge:

```txt
Combining smart contract escrow, backend signing, game state, and delayed payout logic.
```

#### 3. Production URL Shortener

Category:

```txt
Backend / System Design / Analytics
```

Stack:

```txt
FastAPI, PostgreSQL, Redis, React, Tailwind CSS
```

Description:

```txt
A production-style URL shortener with custom slugs, expiry, QR codes, password protection, and analytics.
```

Engineering challenge:

```txt
Optimizing redirect speed, click ingestion, Redis caching, and analytics rollups.
```

#### 4. Token Approval Scanner

Category:

```txt
Web3 / Security Tool
```

Stack:

```txt
React, Web3.js/Ethers, Blockchain RPC APIs
```

Description:

```txt
A tool that helps users inspect active token approvals and revoke risky allowances.
```

Engineering challenge:

```txt
Reading wallet allowances and creating a clean interface for safer Web3 usage.
```

---

## 9. Project Case Study Pages

Each major project should have a dedicated case-study page.

### Case Study Route Pattern

```txt
/projects/[slug]
```

### Case Study Layout

Each case study should include:

1. Project title
2. One-line summary
3. Project metadata
4. Problem
5. Solution
6. Core features
7. Architecture
8. Tech stack
9. Challenges
10. Screenshots or UI mockups
11. What I learned
12. Links

### Case Study Metadata

Example:

```txt
Status: Live
Role: Fullstack Developer
Timeline: Personal project
Focus: Backend architecture, monitoring, alerting
Stack: FastAPI, PostgreSQL, React, Nginx
```

### Architecture Section

Use a clean diagram-like component.

Example for WATCHDOG:

```txt
User Dashboard
    ↓
FastAPI Backend
    ↓
Monitor Scheduler
    ↓
Checker Service
    ↓
Check Results / Incidents
    ↓
Alert Service
    ↓
Email / Telegram / WhatsApp
```

This can be rendered as connected cards.

---

## 10. Blog System

The blog should be built with MDX.

### Blog Route

```txt
/blog
/blog/[slug]
```

### Blog Categories

Use these categories:

```txt
Backend Engineering
FastAPI
Django
Go
System Design
DevOps
Web3
Project Logs
Learning Notes
```

### Blog Listing Card

Each blog card should include:

* Title
* Description
* Category
* Tags
* Date
* Reading time

### Blog Post Layout

Blog posts should have:

* Large title
* Description
* Date
* Reading time
* Tags
* Table of contents
* MDX content
* Styled code blocks
* Copy code button
* Previous/next article

### Initial Blog Post Ideas

Create placeholder/sample posts for:

```txt
How I Built an Uptime Monitor with FastAPI
How API Gateways Work: A Beginner-Friendly Breakdown
Django vs FastAPI: When I Use Each
Building a Production-Ready URL Shortener
What I Learned Moving from Python to Go
Designing Scheduler Workers for Monitoring Systems
```

### Blog Design

The blog must prioritize readability.

Use:

* Max content width around 720px to 820px
* Clear headings
* Comfortable line height
* Good code block styling
* Subtle borders
* No cramped text

---

## 11. About Page

The about page should be personal but still professional.

### About Copy Direction

Base copy:

```txt
I’m Michael Abulude, a Telecommunication Engineer and a backend-focused fullstack developer. I enjoy building automation tools, monitoring systems, APIs and practical web products that solve real problems.

My main stack includes Python, FastAPI, Django, PostgreSQL, React, Tailwind CSS, and Go. I also explore Web3 systems and have written a few smart contracts using vyper
```

### Sections

1. Short personal intro
2. Developer journey
3. What I build
4. Current focus
5. Tech stack
6. Contact CTA

### Developer Journey Timeline

Use this timeline:

```txt
2021 — Started learning programming
2023 — Began building freelance Django/FastAPI projects
2024 — Built multiple backend and fullstack applications
2025 — Focused on monitoring tools, Web3 systems, and production backend projects
2026 — Expanding into Go, infrastructure tools, and backend architecture
```

---

## 12. Now Page

The `/now` page should show what Michael is currently focused on.

### Purpose

This page makes the site feel alive and current.

### Sections

```txt
Currently Building
Currently Learning
Current Focus
Recent Wins
Next Goals
```

### Sample Content

```txt
Currently Building
- Personal developer command center
- Go reverse proxy / API gateway
- WATCHDOG alert improvements

Currently Learning
- Go backend development
- API gateway architecture
- Advanced React/Tailwind UI patterns

Current Focus
- Backend systems
- Monitoring platforms
- Developer tools
- Technical writing
```

### Design

Render it like a public status board.

Use cards, status dots, and timestamps.

---

## 13. Resume Page

Create both:

1. A web resume page
2. A downloadable PDF resume button

### Resume Sections

```txt
Profile
Technical Skills
Projects
Experience
Education
Contact
```

### Profile Summary

```txt
Backend-focused fullstack developer with experience building APIs, monitoring systems, fullstack web applications, Web3 tools, and production-ready backend services using Python, FastAPI, Django, React, PostgreSQL, and Linux deployment tools.
```

### Technical Skills

Group skills by category.

```txt
Backend: Python, FastAPI, Django, Go
Frontend: React, Tailwind CSS, HTML, CSS, JavaScript
Database: PostgreSQL, SQLite, Redis
DevOps: Linux VPS, Nginx, Gunicorn/Uvicorn, Git, GitHub, SSL/HTTPS
Web3: Vyper
Tools: Postman, GitHub, VS Code, WSL
```

Avoid skill percentage bars.

---

## 14. Contact Page

The contact page should be simple and direct.

### Contact Options

Include:

```txt
Email
GitHub
LinkedIn
Twitter/X
Resume download
```

### Contact Form

Fields:

```txt
Name
Email
Subject
Message
```

The first version can use a mailto link or a simple form service. Later, connect it to a FastAPI backend.

### Contact CTA Text

```txt
Interested in working together, hiring me, or discussing a backend project? Send me a message.
```

---

## 15. Optional Lab Page

The `/lab` page can contain experimental tools and mini demos.

### Purpose

Show curiosity and practical engineering ability.

### Possible Lab Items

```txt
API Status Checker
JWT Decoder
URL Metadata Previewer
Cron Expression Helper
HTTP Header Inspector
Simple Markdown Previewer
```

Each lab item should be small, polished, and useful.

---

## 16. Standout Features

These features should help the site stand out.

### 1. Command Palette

Add a command palette triggered by:

```txt
Ctrl + K
```

It should allow users to:

* Search projects
* Search blog posts
* Go to resume
* Go to contact
* Open GitHub
* Open WATCHDOG
* Open latest posts

Use a clean modal interface.

### 2. System Status Widget

Add a small status widget on the homepage.

Example:

```txt
System Status
Portfolio: Online
WATCHDOG: Online
Blog: Online
Last checked: 2 minutes ago
```

For MVP, status can be static/mock data. Later, connect it to WATCHDOG or a backend API.

### 3. Project Architecture Diagrams

Render architecture flows as connected cards.

Do not rely only on images. Use actual HTML/CSS components where possible.

### 4. Latest Writing Section

Show the latest 3 blog posts on the homepage.

### 5. Now Building Widget

Show the current build focus on the homepage.

Example:

```txt
Now Building
Go API Gateway
Personal Dev Command Center
WATCHDOG Alert System
```

### 6. GitHub Activity Widget

Optional for later.

Display:

* Latest repositories
* Recent commits
* Featured repos

For MVP, this can be static.

---

## 17. Components to Build

Create reusable components.

### Layout Components

```txt
Navbar
Footer
MobileMenu
PageHeader
SectionHeader
Container
```

### UI Components

```txt
Button
Badge
Card
StatusDot
TechBadge
CommandPalette
ThemeToggle
CodeBlock
Timeline
```

### Feature Components

```txt
HeroSection
SystemSnapshotCard
FeaturedProjectCard
ProjectCard
ProjectGrid
BlogCard
LatestPosts
NowBuildingCard
TechStackGrid
ArchitectureDiagram
ResumeSection
ContactForm
```

---

## 18. Data Structure

Use local data files for MVP.

Suggested folder:

```txt
src/data/projects.ts
src/data/blog.ts
src/data/stack.ts
src/data/now.ts
src/data/socials.ts
```

### Project Data Shape

```ts
export type Project = {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: "Live" | "In Progress" | "Archived";
  stack: string[];
  challenge: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl: string;
  featured: boolean;
};
```

### Blog Data Shape

```ts
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  readingTime: string;
  featured?: boolean;
};
```

### Now Data Shape

```ts
export type NowItem = {
  title: string;
  items: string[];
};
```

---

## 19. Folder Structure

Use a clean Next.js App Router structure.

```txt
personal-dev-website/
  src/
    app/
      page.tsx
      about/
        page.tsx
      projects/
        page.tsx
        [slug]/
          page.tsx
      blog/
        page.tsx
        [slug]/
          page.tsx
      now/
        page.tsx
      resume/
        page.tsx
      contact/
        page.tsx
      lab/
        page.tsx
      layout.tsx
      globals.css
    components/
      layout/
      ui/
      sections/
      projects/
      blog/
      resume/
      command-palette/
    content/
      blog/
      projects/
    data/
      projects.ts
      stack.ts
      now.ts
      socials.ts
    lib/
      mdx.ts
      utils.ts
  public/
    images/
    resume/
  README.md
```

---

## 20. SEO Requirements

Every page should have proper metadata.

### Homepage Title

```txt
Michael Abulude — Backend-Focused Fullstack Developer
```

### Homepage Description

```txt
Personal website of Michael Abulude, a backend-focused fullstack developer building APIs, monitoring tools, automation systems, and practical web products with Python, FastAPI, Django, Go, React, and PostgreSQL.
```

### Project Page Metadata

Each project page should have:

* Title
* Description
* Open Graph image placeholder
* Canonical URL

### Blog Metadata

Each blog post should have:

* Title
* Description
* Date
* Tags
* Open Graph metadata

---

## 21. Accessibility Requirements

The site must be accessible and keyboard-friendly.

Requirements:

* Semantic HTML
* Good contrast
* Keyboard navigation
* Visible focus states
* Alt text for images
* Buttons must be actual buttons
* Links must be actual links
* Command palette must be keyboard accessible
* Mobile menu must be accessible

---

## 22. Responsiveness Requirements

The site must work well on:

```txt
Mobile: 320px+
Tablet: 768px+
Desktop: 1024px+
Large screens: 1280px+
```

Mobile considerations:

* Stack cards vertically
* Keep hero text readable
* Make buttons full-width or easy to tap
* Avoid tiny text
* Use a clean hamburger menu
* Blog reading width should be comfortable

---

## 23. Animation Rules

Use animations sparingly.

Good animations:

* Section fade-in
* Card hover lift
* Border glow on hover
* Smooth command palette open/close
* Status dot pulse

Avoid:

* Heavy particle backgrounds
* Slow page transitions
* Distracting bouncing elements
* Over-animation on blog pages

The site must feel fast.

---

## 24. MVP Build Scope

The first version should include:

```txt
Home page
About page
Projects page
3 project case-study pages
Blog listing page
3 sample blog posts
Now page
Resume page
Contact page
Dark theme
Responsive navbar
Project cards
Blog cards
Command palette
System snapshot card
```

---

## 25. Phase 2 Features

After MVP, add:

```txt
Live GitHub activity
Real contact form backend
Newsletter signup
Portfolio search
AI “Ask my portfolio” feature
Dynamic system status from WATCHDOG
Blog post filtering/search
RSS feed
Sitemap
OG image generation
```

---

## 26. AI “Ask My Portfolio” Feature — Future Plan

This is a future standout feature.

### Purpose

Allow visitors to ask questions like:

```txt
What projects has Michael built with FastAPI?
What is WATCHDOG?
Does Michael know Django?
What backend systems has he built?
```

### Expected Answer Source

The AI should only answer using content from:

* Projects
* Blog posts
* Resume
* About page
* Case studies

### Future Backend

Use:

* FastAPI
* PostgreSQL or vector database
* Embeddings
* RAG pipeline

For now, do not implement unless requested.

---

## 27. Content Tone

The writing should be:

* Clear
* Confident
* Technical
* Human
* Not exaggerated
* Not too corporate
* Not too casual

Avoid vague phrases like:

```txt
I create beautiful websites.
I am passionate about technology.
I am a hardworking developer.
```

Prefer specific phrases like:

```txt
I build backend systems, APIs, monitoring tools, and practical web products.
I enjoy turning system ideas into working software.
I focus on clean APIs, reliable data flows, and production-aware architecture.
```

---

## 28. Footer

Footer should include:

```txt
Michael Abulude
Backend-focused fullstack developer
GitHub
LinkedIn
Twitter/X
Email
Resume
```

Optional footer text:

```txt
Built with Next.js, Tailwind CSS, and MDX.
```

---

## 29. Initial Content Values

Use these default personal details where needed:

```txt
Name: Michael Abulude
Developer Identity: Backend-Focused Fullstack Developer
Website: clevermike.studio
Email: clevermike02@gmail.com
GitHub: mikky00B
Main Stack: Python, FastAPI, Django, Go, React, Tailwind CSS, PostgreSQL
```

Do not include phone number unless explicitly added later.

---

## 30. Build Quality Expectations

The final site should feel like a real product.

Quality expectations:

* Clean design
* Good spacing
* Fully responsive
* No broken links
* No placeholder lorem ipsum
* Strong project presentation
* Blog-ready structure
* Easy to update content
* Fast loading
* SEO-friendly
* Accessible
* Professional enough to send to recruiters or clients

---

## 31. Agent Implementation Instructions

When building this project:

1. Start with the Next.js project setup.
2. Configure Tailwind CSS and global theme tokens.
3. Build layout, navbar, footer, and reusable UI components.
4. Create local data files for projects, stack, now page, and socials.
5. Build the homepage.
6. Build the projects page.
7. Build project case-study pages.
8. Build blog listing and MDX blog support.
9. Build about, now, resume, and contact pages.
10. Add command palette.
11. Polish responsiveness and animations.
12. Add SEO metadata.
13. Test all routes.
14. Ensure the UI feels consistent across the site.

Do not overcomplicate the MVP with authentication, admin dashboards, or databases. Keep the first version content-driven and easy to deploy.

---

## 32. Definition of Done

The project is complete when:

* All core pages are implemented
* The design matches the dark technical dashboard direction
* Projects are presented with strong details
* Blog system supports MDX posts
* Site is mobile responsive
* Command palette works
* Resume page exists
* Contact page exists
* SEO metadata is added
* No major accessibility issues exist
* Site can be deployed successfully

---

## 33. Final Design Summary

Build a dark, polished, dashboard-inspired personal developer website for Michael Abulude.

The website should position him as a backend-focused fullstack developer who builds APIs, monitoring tools, automation systems, and practical web products.

The site should combine:

* Portfolio
* Blog
* Resume
* Project case studies
* Now page
* Developer command center feel

Signature features:

* WATCHDOG featured project
* System status widget
* Command palette
* Project architecture diagrams
* Technical blog
* Now building dashboard

The final result should be clean, serious, technical, and memorable.
