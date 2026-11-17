import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { Footer } from "@/components/layout/Footer";
import { HiddenOnHome } from "@/components/layout/HiddenOnHome";
import { Navbar } from "@/components/layout/Navbar";
import { getPostSummaries } from "@/lib/posts";

// Self-hosted variable fonts (latin subsets) for the tree homepage; the CSS
// variables fall back gracefully for the rest of the site.
const franklin = localFont({
  src: "./fonts/libre-franklin.woff2",
  weight: "300 600",
  variable: "--font-app-sans",
  display: "swap"
});

const caveat = localFont({
  src: "./fonts/caveat.woff2",
  weight: "400 700",
  variable: "--font-app-hand",
  display: "swap"
});

const mono = localFont({
  src: "./fonts/jetbrains-mono.woff2",
  weight: "100 800",
  variable: "--font-app-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clevermike.studio"),
  title: {
    default: "Michael Abulude - Software Engineer",
    template: "%s | Michael Abulude"
  },
  description:
    "Personal website of Michael Abulude, a software engineer focused on backend systems, infrastructure, and developer tools — building reliable software that solves practical engineering problems with Python, FastAPI, Django, Go, React, and PostgreSQL.",
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml"
    }
  },
  openGraph: {
    title: "Michael Abulude - Software Engineer",
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
      <body
        className={`${franklin.variable} ${caveat.variable} ${mono.variable} min-h-screen font-sans antialiased`}
      >
        <Navbar />
        <CommandPalette posts={palettePosts} />
        <main>{children}</main>
        <HiddenOnHome>
          <Footer />
        </HiddenOnHome>
      </body>
    </html>
  );
}
