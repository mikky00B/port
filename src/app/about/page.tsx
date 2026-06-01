import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { stackGroups } from "@/data/stack";

export const metadata: Metadata = {
  title: "About",
  description: "About Michael Abulude, a Telecommunication Engineer and backend-focused fullstack developer."
};

const journey = [
  ["2021", "Started learning programming"],
  ["2023", "Began building freelance Django/FastAPI projects"],
  ["2024", "Built multiple backend and fullstack applications"],
  ["2025", "Focused on monitoring tools, Web3 systems, and production backend projects"],
  ["2026", "Expanding into Go, infrastructure tools, and backend architecture"]
];

export default function AboutPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="About"
        title="I build backend systems, APIs, monitoring tools, and practical web products."
        description="I am Michael Abulude, a Telecommunication Engineer and a backend-focused fullstack developer."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <p className="leading-8 text-muted">
            I enjoy building automation tools, monitoring systems, APIs, and practical web products that solve real problems.
          </p>
          <p className="mt-5 leading-8 text-muted">
            My main stack includes Python, FastAPI, Django, PostgreSQL, React, Tailwind CSS, and Go. I also explore Web3 systems and have written smart contracts using Vyper.
          </p>
          <div className="mt-8">
            <Button href="/contact">Start a conversation</Button>
          </div>
        </Card>

        <Card>
          <h2 className="font-heading text-xl font-semibold text-text">Developer Journey</h2>
          <div className="mt-6 space-y-5">
            {journey.map(([year, text]) => (
              <div key={year} className="grid grid-cols-[4rem_1fr] gap-4">
                <span className="font-mono text-sm text-accent">{year}</span>
                <p className="border-l border-line pl-4 text-sm leading-6 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {["Clean APIs", "Reliable data flows", "Production-aware architecture"].map((item) => (
          <Card key={item}>
            <h3 className="font-heading text-lg font-semibold text-text">{item}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              I prefer implementation choices that are easy to understand, test, deploy, and operate.
            </p>
          </Card>
        ))}
      </div>

      <section className="mt-16">
        <SectionHeader eyebrow="Tech stack" title="Current tools." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stackGroups.map((group) => (
            <Card key={group.title}>
              <h3 className="font-heading text-lg font-semibold text-text">{group.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{group.items.join(", ")}</p>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
