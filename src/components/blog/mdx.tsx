import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { CodeBlock } from "@/components/ui/CodeBlock";

function Pre({ children }: React.ComponentPropsWithoutRef<"pre">) {
  return <CodeBlock>{children}</CodeBlock>;
}

export const mdxComponents = {
  pre: Pre,
  ArchitectureDiagram
};
