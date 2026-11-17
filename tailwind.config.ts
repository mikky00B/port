import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        // shared site palette — retargeted to the tree's warm paper tones so
        // the blog and remaining pages read as part of the same scene
        background: "#171614", // bark
        panel: "#1c1b18", // sheet
        panel2: "#141311", // soot
        line: "#34312a", // bone/12 over bark
        text: "#dedbd2", // bone
        muted: "#b5b2a9", // moss
        dim: "#8a8781", // ash
        accent: "#c9a25e", // gilt
        success: "#a8a59c", // fog
        warning: "#c9a25e", // gilt
        error: "#dedbd2", // bone
        // tree homepage palette
        bark: "#171614",
        sheet: "#1c1b18",
        soot: "#141311",
        bone: "#dedbd2",
        glint: "#e7e5dd",
        note: "#c9c6bd",
        ash: "#8a8781",
        fog: "#a8a59c",
        moss: "#b5b2a9",
        gilt: "#c9a25e"
      },
      fontFamily: {
        heading: ["var(--font-app-sans)", "Inter", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-app-sans)", "Inter", "ui-sans-serif", "system-ui"],
        mono: [
          "var(--font-app-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "monospace"
        ],
        hand: ["var(--font-app-hand)", "Segoe Script", "cursive"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255, 255, 255, 0.06), 0 24px 70px rgba(0, 0, 0, 0.42)"
      }
    }
  },
  plugins: []
};

export default config;
