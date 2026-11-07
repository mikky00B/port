import { ProjectCard } from "@/components/projects/ProjectCard";
import { ShelfPlate } from "@/components/home/ShelfPlate";
import { PostCard } from "@/components/blog/PostCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusDot } from "@/components/ui/StatusDot";
import { nowItems } from "@/data/now";
import { getEarlierProjects, getFeaturedProjects } from "@/data/projects";
import { socials } from "@/data/socials";
import { getPostsInOrder } from "@/lib/posts";
import Link from "next/link";

export default function HomePage() {
  const nowBuilding = nowItems[0].items;
  const featuredProjects = getFeaturedProjects();
  const earlierProjects = getEarlierProjects();
  const selectedPosts = getPostsInOrder([
    "termii-messaging-architecture-deep-dive",
    "deploydock-release-pipeline"
  ]);

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
              <p className="mt-4 text-xl font-medium text-accent">{socials.identity}</p>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
                I build scalable APIs, monitoring tools, automation systems, and practical web systems using Python and Go.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/#projects">View Projects</Button>
                <Button href="/contact" variant="secondary">Contact Me</Button>
                <Button
                  href={socials.resume}
                  variant="ghost"
                  download={socials.resumeFile}
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
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        {earlierProjects.length > 0 ? (
          <section className="py-8">
            <SectionHeader eyebrow="Earlier" title="Earlier work." />
            <div className="mt-8 divide-y divide-line border-y border-line">
              {earlierProjects.map((project) => (
                <div key={project.slug} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-heading text-lg font-semibold text-text">{project.title}</h3>
                      <Badge>{project.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted">{project.description}</p>
                  </div>
                  <div className="flex shrink-0 gap-4">
                    {project.githubUrl ? (
                      <Link
                        className="focus-ring rounded font-mono text-xs uppercase tracking-[0.16em] text-dim hover:text-text"
                        href={project.githubUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        GitHub
                      </Link>
                    ) : null}
                    {project.liveUrl ? (
                      <Link
                        className="focus-ring rounded font-mono text-xs uppercase tracking-[0.16em] text-dim hover:text-text"
                        href={project.liveUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Live
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {selectedPosts.length > 0 ? (
          <section className="py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeader eyebrow="Writing" title="Selected writing." />
              <Link
                className="focus-ring rounded font-mono text-xs uppercase tracking-[0.18em] text-dim transition hover:text-text"
                href="/blog"
              >
                All posts →
              </Link>
            </div>
            <div className="mt-8 grid gap-5">
              {selectedPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        ) : null}

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
