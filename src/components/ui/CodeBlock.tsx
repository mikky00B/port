"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: React.ReactNode };
    return extractText(props.children);
  }

  return "";
}

export function CodeBlock({ children }: { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const code = extractText(children).trim();

  async function copyCode() {
    if (!code) {
      return;
    }

    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="group relative mt-5">
      <button
        className="focus-ring absolute right-3 top-3 inline-flex items-center gap-1 rounded border border-line bg-panel px-2 py-1 text-xs text-muted opacity-100 transition hover:text-text sm:opacity-0 sm:group-hover:opacity-100"
        type="button"
        onClick={copyCode}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre>{children}</pre>
    </div>
  );
}
