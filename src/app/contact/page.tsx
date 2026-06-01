import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { socials } from "@/data/socials";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Michael Abulude for backend roles, freelance projects, and collaborations."
};

export default function ContactPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Contact"
        title="Interested in working together, hiring me, or discussing a backend project?"
        description="Reach me directly through email or any of the links below."
      />

      <Card className="mt-10 max-w-2xl">
        <h2 className="font-heading text-xl font-semibold text-text">Contact Options</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            ["Email", `mailto:${socials.email}`],
            ["GitHub", socials.github],
            ["LinkedIn", socials.linkedin],
            ["Twitter/X", socials.twitter],
            ["Resume", "/resume"]
          ].map(([label, href]) => (
            <Link key={label} className="focus-ring rounded-md border border-line px-4 py-3 text-sm text-muted hover:border-accent hover:text-accent" href={href}>
              {label}
            </Link>
          ))}
        </div>
      </Card>
    </Container>
  );
}
