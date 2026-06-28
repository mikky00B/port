import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants = {
  primary: "border-text bg-text text-background hover:bg-neutral-200",
  secondary: "border-line bg-panel text-text hover:border-text hover:bg-panel2",
  ghost: "border-transparent bg-transparent text-muted hover:text-text"
};

export function Button({ href, children, variant = "primary", className }: ButtonProps) {
  const classes = cn(
    "focus-ring inline-flex min-h-11 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition",
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
