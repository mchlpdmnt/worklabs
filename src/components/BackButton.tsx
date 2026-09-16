import { FlowButton } from "./FlowButton";

export function BackButton({ href, text }: { href: string; text: string }) {
  return <FlowButton href={href} text={text} shape="rectangle" direction="left" className="flow-control back-link" />;
}
