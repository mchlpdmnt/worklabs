"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type SharedProps = {
  text?: string;
  shape?: "pill" | "rectangle";
  direction?: "left" | "right";
  icon?: ReactNode;
  hoverIcon?: ReactNode;
};

export type FlowButtonProps = SharedProps & (
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
);

export function FlowButton({ text = "Modern Button", className, shape = "pill", direction = "right", icon, hoverIcon, ...props }: FlowButtonProps) {
  const disabled = "disabled" in props && props.disabled;
  const Arrow = direction === "left" ? ArrowLeft : ArrowRight;
  const rootClass = `relative inline-flex items-center justify-center gap-1 overflow-hidden ${shape === "rectangle" ? "rounded-md" : "rounded-full"} border-[1.5px] border-[#333333]/40 bg-transparent px-8 py-3 text-sm font-semibold text-[#111111] no-underline transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${disabled ? "cursor-not-allowed opacity-50" : "group cursor-pointer hover:border-transparent hover:text-white focus-visible:text-white active:scale-[0.95] motion-reduce:active:scale-100"} ${className ?? ""}`;
  const incoming = direction === "left" ? "right-[-25%] group-hover:right-4 group-focus-visible:right-4" : "left-[-25%] group-hover:left-4 group-focus-visible:left-4";
  const outgoing = direction === "left" ? "left-4 group-hover:left-[-25%] group-focus-visible:left-[-25%]" : "right-4 group-hover:right-[-25%] group-focus-visible:right-[-25%]";
  const textFlow = direction === "left" ? "translate-x-3 group-hover:-translate-x-3 group-focus-visible:-translate-x-3" : "-translate-x-3 group-hover:translate-x-3 group-focus-visible:translate-x-3";
  const flowIconClass = "absolute z-[9] size-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none";
  const arrowClass = `${flowIconClass} fill-none stroke-[#111111] group-hover:stroke-white group-focus-visible:stroke-white`;
  const content = <>
    {hoverIcon ? (
      <span aria-hidden="true" className={`flow-button__incoming inline-flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [&>svg]:size-full ${flowIconClass} ${incoming}`}>{hoverIcon}</span>
    ) : (
      <Arrow aria-hidden="true" className={`flow-button__incoming ${arrowClass} ${incoming}`} />
    )}
    <span className={`flow-button__label relative z-[1] inline-flex items-center gap-2 whitespace-nowrap transition-all duration-[800ms] ease-out motion-reduce:transition-none ${textFlow}`}>
      {icon}{text}
    </span>
    <span aria-hidden="true" className="flow-button__fill absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111111] opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:size-[220px] group-hover:opacity-100 group-focus-visible:size-[220px] group-focus-visible:opacity-100 motion-reduce:transition-none" />
    <Arrow aria-hidden="true" className={`flow-button__outgoing ${arrowClass} ${outgoing} ${hoverIcon ? "group-hover:opacity-0 group-focus-visible:opacity-0" : ""}`} />
  </>;
  if (props.href !== undefined) return <a className={rootClass} {...props}>{content}</a>;
  return <button className={rootClass} {...props} type={props.type ?? "button"}>{content}</button>;
}
