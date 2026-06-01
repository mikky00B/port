import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B1120",
        panel: "#111827",
        panel2: "#0F172A",
        line: "#1F2937",
        text: "#F9FAFB",
        muted: "#9CA3AF",
        dim: "#6B7280",
        accent: "#38BDF8",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444"
      },
      fontFamily: {
        heading: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56, 189, 248, 0.18), 0 18px 60px rgba(15, 23, 42, 0.42)"
      }
    }
  },
  plugins: []
};

export default config;
