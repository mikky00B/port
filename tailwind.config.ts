import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        panel: "#111111",
        panel2: "#181818",
        line: "#2A2A2A",
        text: "#F5F5F5",
        muted: "#A3A3A3",
        dim: "#737373",
        accent: "#FFFFFF",
        success: "#E5E5E5",
        warning: "#D4D4D4",
        error: "#F5F5F5"
      },
      fontFamily: {
        heading: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255, 255, 255, 0.06), 0 24px 70px rgba(0, 0, 0, 0.42)"
      }
    }
  },
  plugins: []
};

export default config;
