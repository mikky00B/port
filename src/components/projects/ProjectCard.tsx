import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Project } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { TechBadge } from "@/components/ui/TechBadge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-accent">{project.category}</p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-text">{project.title}</h3>
        </div>
        <Badge>{project.status}</Badge>
      </div>
      <p className="mt-4 flex-1 leading-7 text-muted">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.slice(0, 5).map((tech) => (
          <TechBadge key={tech}>{tech}</TechBadge>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-400">
        <span className="text-text">Challenge:</span> {project.challenge}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {project.liveUrl ? (
          <Link
            className="focus-ring inline-flex items-center gap-1 rounded-md border border-accent px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/10"
            href={project.liveUrl}
            rel="noreferrer"
            target="_blank"
          >
            Live URL <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : null}
        {project.githubUrl ? (
          <Link
            className="focus-ring inline-flex items-center gap-1 rounded-md border border-line px-3 py-2 text-sm font-semibold text-muted hover:border-accent hover:text-text"
            href={project.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            GitHub <Github className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
