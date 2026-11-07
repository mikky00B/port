import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { resumeEducation, resumeProfile, resumeRoles, resumeSkills } from "@/data/resume";
import { socials } from "@/data/socials";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume for Michael Abulude, software engineer."
};

export default function ResumePage() {
  return (
    <Container className="py-16">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <SectionHeader eyebrow="Resume" title={socials.name} description={resumeProfile.summary} />
          <p className="mt-4 text-sm leading-7 text-muted">
            {socials.identity}
            {" · "}
            {resumeProfile.location}
            {" · "}
            <Link className="focus-ring rounded underline decoration-line underline-offset-4 hover:decoration-accent" href={`mailto:${socials.email}`}>
              {socials.email}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-4 sm:items-end">
          <Image
            src="/clevermike.jpeg"
            alt="Portrait of Michael Abulude"
            width={810}
            height={1080}
            priority
            className="h-40 w-auto rounded-lg border border-line object-cover"
          />
          <Button href={socials.resume} download={socials.resumeFile}>
            Download PDF
          </Button>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-semibold text-text">Experience</h2>
        <div className="mt-5 space-y-5">
          {resumeRoles.map((role) => (
            <Card key={`${role.org}-${role.dates}`}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-heading text-lg font-semibold text-text">{role.title}</h3>
                <p className="font-mono text-xs text-dim">{role.dates}</p>
              </div>
              <p className="mt-1 text-sm text-accent">{role.org}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
                {role.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <h2 className="font-heading text-xl font-semibold text-text">Technical skills</h2>
          <div className="mt-6 space-y-4">
            {resumeSkills.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-medium text-text">{group.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{group.items.join(", ")}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-heading text-xl font-semibold text-text">Education</h2>
          <p className="mt-4 font-medium text-text">{resumeEducation.degree}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{resumeEducation.school}</p>
          <p className="mt-3 font-mono text-xs text-dim">{resumeEducation.year}</p>
        </Card>
      </div>
    </Container>
  );
}
