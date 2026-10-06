import { ProjectCard } from "@/components/projects/ProjectCard";
import { ShelfPlate } from "@/components/home/ShelfPlate";
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
        <section className="relative flex min-h-[calc(100vh-4rem)] items-center py-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">clevermike.studio</p>
              <h1 className="mt-3 font-heading text-5xl font-semibold tracking-tight text-text sm:text-6xl">
                Michael Abulude
              </h1>
              <p className="mt-4 text-xl font-medium text-accent">Backend-Focused Software Developer</p>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
                I build scalable APIs, monitoring tools, automation systems, and practical web systems using Python and Go.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/#projects">View Projects</Button>
                <Button href="/contact" variant="secondary">Contact Me</Button>
                <Button
                  href={socials.resume}
                  variant="ghost"
                  download="Michael_Abulude_Backend_Developer_Resu.pdf"
                >
                  Download Resume
                </Button>
              </div>
            </div>
            <ShelfPlate />
          </div>
          <span className="absolute bottom-2 left-0 font-mono text-xs uppercase tracking-[0.22em] text-dim">
            scroll ↓
          </span>
        </section>

        <section id="projects" className="scroll-mt-24 py-16">
          <SectionHeader
            eyebrow="Projects"
            title="A look at some of my recent projects."
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
                  <StatusDot />
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="py-16">
          <Card className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-text">Interested in hiring me for a role?</h2>
              <p className="mt-2 text-muted">Send a message about a role, freelance project, or collaboration.</p>
            </div>
            <Button href="/contact">Contact Michael</Button>
          </Card>
        </section>
      </Container>
    </div>
  );
}
