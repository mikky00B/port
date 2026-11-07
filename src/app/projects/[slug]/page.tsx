import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { getProject, projects } from "@/data/projects";
import { getPostsForProject } from "@/lib/posts";

export function generateStaticParams() {
  return projects
    .filter((project) => project.caseStudyUrl)
    .map((project) => ({ slug: project.slug }));
}

type ProjectRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudyUrl) {
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

  if (!project?.caseStudyUrl) {
    notFound();
  }

  const writeUps = getPostsForProject(project.slug);

  return (
    <Container className="py-16">
      <div className="max-w-3xl">
        <Badge>{project.status}</Badge>
        <h1 className="mt-5 font-heading text-4xl font-semibold text-text sm:text-5xl">{project.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted">{project.summary}</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ["Focus", project.focus],
          ["Category", project.category],
          ["Stack", project.stack.join(", ")]
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{label}</p>
            <p className="mt-3 text-sm font-medium leading-6 text-text">{value}</p>
          </Card>
        ))}
      </div>

      {project.image ? (
        <figure className="mt-10 overflow-hidden rounded-lg border border-line bg-black">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            className="h-auto w-full"
            sizes="(min-width: 1152px) 1088px, 100vw"
          />
        </figure>
      ) : null}

      <div className="mt-16 grid items-start gap-8 lg:grid-cols-2">
        <Card>
          <h2 className="font-heading text-xl font-semibold text-text">The problem</h2>
          <p className="mt-5 text-sm leading-7 text-muted">{project.challenge}</p>
        </Card>
        <div>
          <h2 className="font-heading text-xl font-semibold text-text">Architecture</h2>
          <div className="mt-5">
            <ArchitectureDiagram items={project.architecture} />
          </div>
        </div>
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

      {writeUps.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-heading text-xl font-semibold text-text">Write-ups</h2>
          <div className="mt-5 grid gap-5">
            {writeUps.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        {project.liveUrl ? <Button href={project.liveUrl}>Live Site</Button> : null}
        {project.githubUrl ? <Button href={project.githubUrl} variant="secondary">GitHub</Button> : null}
        <Button href="/projects" variant="ghost">Back to Projects</Button>
      </div>
    </Container>
  );
}
