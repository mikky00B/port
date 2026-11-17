import { TreeHome } from "@/components/tree/TreeHome";
import { getTreeContent } from "@/lib/tree-content";

export default function HomePage() {
  const content = getTreeContent();
  return <TreeHome content={content} />;
}
