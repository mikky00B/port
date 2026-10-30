import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { FlowDiagram } from "@/components/blog/FlowDiagram";
import { RateBars } from "@/components/blog/RateBars";

function Pre({ children }: React.ComponentPropsWithoutRef<"pre">) {
  return <CodeBlock>{children}</CodeBlock>;
}

export const mdxComponents = {
  pre: Pre,
  ArchitectureDiagram,
  FlowDiagram,
  RateBars
};
