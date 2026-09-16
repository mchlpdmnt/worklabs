import {
  Cards,
  CursorClick,
  Layout,
  ShareNetwork,
  Swap,
} from "@phosphor-icons/react";

interface ComponentMarkProps {
  category: string;
  size?: number;
}

export function ComponentMark({ category, size = 22 }: ComponentMarkProps) {
  const props = { size, weight: "regular" as const, "aria-hidden": true };
  if (category === "Actions") return <CursorClick {...props} />;
  if (category === "Transitions") return <Swap {...props} />;
  if (category === "Social") return <ShareNetwork {...props} />;
  if (category === "Content") return <Layout {...props} />;
  return <Cards {...props} />;
}
