"use client";

import { usePathname } from "next/navigation";

// Hides site chrome on the tree homepage — the scene fills the viewport and
// carries its own navigation.
export function HiddenOnHome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <>{children}</>;
}
