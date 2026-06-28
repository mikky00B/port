import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

type ProjectRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`
    },
    openGraph: {
      title: `${project.title} - Project Case Study`,
      description: project.summary,
      url: `/projects/${project.slug}`
    }
  };
}

export default async function ProjectCaseStudyPage({ params }: ProjectRouteProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <Container className="py-16">
      <div className="max-w-3xl">
        <Badge>{project.status}</Badge>
        <h1 className="mt-5 font-heading text-4xl font-semibold text-text sm:text-5xl">{project.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted">{project.summary}</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-4">
        {[
          ["Role", "Fullstack Developer"],
          ["Timeline", "Personal project"],
          ["Focus", project.focus],
          ["Category", project.category]
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{label}</p>
            <p className="mt-3 text-sm font-medium leading-6 text-text">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <section>
            <SectionHeader eyebrow="Solution" title="A focused, system-first implementation." />
            <p className="mt-4 leading-8 text-muted">
              The project turns the core problem into clear services, explicit data flows, and a dashboard that makes operational state easy to inspect.
            </p>
          </section>
        </div>
        <section>
          <SectionHeader eyebrow="Architecture" title="System flow." />
          <div className="mt-6">
            <ArchitectureDiagram items={project.architecture} />
          </div>
        </section>
      </div>

      <div className="mt-16 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="font-heading text-xl font-semibold text-text">Core Features</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-heading text-xl font-semibold text-text">What I Learned</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
            {project.lessons.map((lesson) => (
              <li key={lesson}>{lesson}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-16">
        <h2 className="font-heading text-xl font-semibold text-text">Screenshots / UI Mockup</h2>
        <div className="mt-5 rounded-lg border border-line bg-black p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {["Overview", "Metrics", "Incidents"].map((panel) => (
              <div key={panel} className="min-h-28 rounded-md border border-line bg-panel2 p-4">
                <p className="font-mono text-xs text-accent">{panel}</p>
                <div className="mt-5 h-2 rounded bg-line" />
                <div className="mt-3 h-2 w-2/3 rounded bg-line" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-10 flex flex-wrap gap-3">
        {project.liveUrl ? <Button href={project.liveUrl}>Live Site</Button> : null}
        {project.githubUrl ? <Button href={project.githubUrl} variant="secondary">GitHub</Button> : null}
        <Button href="/projects" variant="ghost">Back to Projects</Button>
      </div>
    </Container>
  );
}
