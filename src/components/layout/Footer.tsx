import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { socials } from "@/data/socials";

const links = [
  { label: "GitHub", href: socials.github },
  { label: "LinkedIn", href: socials.linkedin },
  { label: "Twitter/X", href: socials.twitter },
  { label: "Email", href: `mailto:${socials.email}` },
  { label: "Resume", href: "/resume" }
];

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading font-semibold text-text">Michael Abulude</p>
          <p className="mt-1 text-sm text-muted">Backend-focused software developer</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {links.map((link) => (
            <Link key={link.label} className="focus-ring rounded text-sm text-muted hover:text-accent" href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
