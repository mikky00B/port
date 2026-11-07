export type ResumeRole = {
  title: string;
  org: string;
  dates: string;
  points: string[];
};

export type ResumeSkillGroup = {
  title: string;
  items: string[];
};

export const resumeProfile = {
  location: "Nigeria (Open to Remote)",
  summary:
    "Software engineer with three years of client experience building REST APIs, monitoring platforms, and backend infrastructure in Python (FastAPI, Django) and Go."
};

export const resumeRoles: ResumeRole[] = [
  {
    title: "Freelance Backend Engineer",
    org: "Turing, Upwork & Independent Clients",
    dates: "2023 – Present",
    points: [
      "Built and delivered backend-driven web applications for e-commerce and business clients, taking projects from requirements to production.",
      "Handled fullstack work on select projects by building React frontends that consume backend APIs, with backend architecture as the primary focus.",
      "Worked directly with remote clients to scope features, iterate on feedback, and maintain codebases after handoff."
    ]
  },
  {
    title: "Software Engineer",
    org: "Venu3D",
    dates: "May 2025 – Jan 2026",
    points: [
      "Built and maintained application features, writing, testing, and reviewing code as part of a development team.",
      "Debugged and resolved software defects."
    ]
  }
];

export const resumeSkills: ResumeSkillGroup[] = [
  { title: "Languages", items: ["Go", "Python", "JavaScript"] },
  { title: "Frameworks & APIs", items: ["Django", "FastAPI", "REST API design", "React (Vite)"] },
  { title: "Databases", items: ["PostgreSQL", "SQLite", "Redis"] },
  { title: "Cloud & DevOps", items: ["Docker", "GitHub Actions", "Jenkins", "Microsoft Azure", "GCP", "Linux"] }
];

export const resumeEducation = {
  degree: "B.Eng. Telecommunication Engineering",
  school: "Federal University of Technology, Minna",
  year: "2026"
};
