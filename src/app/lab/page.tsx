import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Lab",
  description: "Small developer tools and experimental demos by Michael Abulude."
};

const labItems = ["API Status Checker", "JWT Decoder", "URL Metadata Previewer", "Cron Expression Helper", "HTTP Header Inspector", "Simple Markdown Previewer"];

export default function LabPage() {
  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Lab" title="Small tools and experiments." description="A future space for useful developer utilities and focused engineering demos." />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {labItems.map((item) => (
          <Card key={item}>
            <h2 className="font-heading text-xl font-semibold text-text">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Planned utility for the developer command center.</p>
          </Card>
        ))}
      </div>
    </Container>
  );
}
