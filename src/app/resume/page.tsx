import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects } from "@/data/projects";
import { socials } from "@/data/socials";
import { stackGroups } from "@/data/stack";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume for Michael Abulude, backend-focused fullstack developer."
};

export default function ResumePage() {
  return (
    <Container className="py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Resume"
          title="Michael Abulude"
          description="Backend-focused fullstack developer with experience building APIs, monitoring systems, fullstack web applications, Web3 tools, and production-ready backend services using Python, FastAPI, Django, React, PostgreSQL, and Linux deployment tools."
        />
        <Button href={socials.resume}>Download PDF</Button>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="font-heading text-xl font-semibold text-text">Technical Skills</h2>
          <div className="mt-6 space-y-4">
            {stackGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-medium text-text">{group.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{group.items.join(", ")}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="font-heading text-xl font-semibold text-text">Projects</h2>
            <div className="mt-6 space-y-5">
              {projects.slice(0, 3).map((project) => (
                <div key={project.slug}>
                  <h3 className="font-medium text-text">{project.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{project.description}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="font-heading text-xl font-semibold text-text">Experience</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Personal and freelance backend/fullstack project work using Django, FastAPI, React, PostgreSQL, deployment tooling, and Web3 experiments.
            </p>
          </Card>
          <Card>
            <h2 className="font-heading text-xl font-semibold text-text">Education</h2>
            <p className="mt-4 text-sm leading-7 text-muted">Telecommunication Engineering background with ongoing software engineering specialization.</p>
          </Card>
          <Card>
            <h2 className="font-heading text-xl font-semibold text-text">Contact</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{socials.email} - GitHub: {socials.githubHandle}</p>
          </Card>
        </div>
      </div>
    </Container>
  );
}
