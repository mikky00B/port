import type { Metadata } from "next";
import "./globals.css";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://clevermike.studio"),
  title: {
    default: "Michael Abulude - Backend-Focused Software Developer",
    template: "%s | Michael Abulude"
  },
  description:
    "Personal website of Michael Abulude, a backend-focused software developer building APIs, monitoring tools, automation systems, and practical web products with Python, FastAPI, Django, Go, React, and PostgreSQL.",
  openGraph: {
    title: "Michael Abulude - Backend-Focused Software Developer",
    description:
      "Portfolio, resume, and projects for Michael Abulude.",
    url: "https://clevermike.studio",
    siteName: "clevermike.studio",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <Navbar />
        <CommandPalette />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
