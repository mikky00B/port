import type { Metadata } from "next";
import "./globals.css";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getPostSummaries } from "@/lib/posts";

export const metadata: Metadata = {
  metadataBase: new URL("https://clevermike.studio"),
  title: {
    default: "Michael Abulude - Backend-Focused Software Developer",
    template: "%s | Michael Abulude"
  },
  description:
    "Personal website of Michael Abulude, a backend-focused software developer building APIs, monitoring tools, automation systems, and practical web products with Python, FastAPI, Django, Go, React, and PostgreSQL.",
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml"
    }
  },
  openGraph: {
    title: "Michael Abulude - Backend-Focused Software Developer",
    description:
      "Portfolio, resume, and projects for Michael Abulude.",
    url: "https://clevermike.studio",
    siteName: "clevermike.studio",
    type: "website"
  }
};

// The palette is rendered by the root layout, so its post data ships in every
// page payload. Keep it capped and limited to the fields the palette reads.
const PALETTE_POST_LIMIT = 8;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const palettePosts = getPostSummaries()
    .slice(0, PALETTE_POST_LIMIT)
    .map((post) => ({ slug: post.slug, title: post.title, tags: post.tags }));

  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <Navbar />
        <CommandPalette posts={palettePosts} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
