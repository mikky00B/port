import { ProjectCard } from "@/components/projects/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusDot } from "@/components/ui/StatusDot";
import { nowItems } from "@/data/now";
import { projects } from "@/data/projects";
import { socials } from "@/data/socials";

export default function HomePage() {
  const nowBuilding = nowItems[0].items;

  return (
    <div className="dashboard-grid">
      <Container>
        <section className="flex min-h-[calc(100vh-4rem)] items-center py-16">
          <div>
            <Badge className="border-success/30 bg-success/10 text-success">currently Open to job opportunities</Badge>
            <h1 className="mt-6 font-heading text-5xl font-semibold tracking-tight text-text sm:text-6xl">
              Michael Abulude
            </h1>
            <p className="mt-4 text-xl font-medium text-accent">Backend-Focused Software Developer</p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              I build scalable APIs, monitoring tools, automation systems, and practical web apps using Python, FastAPI, Django, Go, React, and PostgreSQL.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/#projects">View Projects</Button>
              <Button href="/contact" variant="secondary">Contact Me</Button>
              <Button href={socials.resume} variant="ghost">Download Resume</Button>
            </div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-24 py-16">
          <SectionHeader
            eyebrow="Projects"
            title="A look at some of my recent projects."
            description="Each project links directly to the live product and GitHub repository when available."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <section className="py-16">
          <Card>
            <h2 className="font-heading text-2xl font-semibold text-text">Now Building</h2>
            <div className="mt-5 space-y-3">
              {nowBuilding.map((item) => (
                <div key={item} className="flex items-center gap-3 text-muted">
                  <StatusDot tone="cyan" />
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="py-16">
          <Card className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-text">Interested in backend systems or practical product work?</h2>
              <p className="mt-2 text-muted">Send a message about a role, freelance project, or collaboration.</p>
            </div>
            <Button href="/contact">Contact Michael</Button>
          </Card>
        </section>
      </Container>
    </div>
  );
}
