import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusDot } from "@/components/ui/StatusDot";
import { nowItems } from "@/data/now";

export const metadata: Metadata = {
  title: "Now",
  description: "Current build focus, learning, recent wins, and next goals for Michael Abulude."
};

export default function NowPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Now"
        title="Current focus board."
        description="A public status board for what I am building, learning, and improving right now. Updated for May 31, 2026."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {nowItems.map((section) => (
          <Card key={section.title}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-heading text-xl font-semibold text-text">{section.title}</h2>
              <span className="font-mono text-xs text-dim">active</span>
            </div>
            <div className="mt-6 space-y-3">
              {section.items.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm leading-6 text-muted">
                  <span className="mt-2"><StatusDot tone="cyan" /></span>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
