"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export interface ButtonWithIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function ButtonWithIcon({ children, className, ...props }: ButtonWithIconProps) {
  return (
    <button
      className={`group relative h-12 w-fit cursor-pointer overflow-hidden rounded-full bg-primary p-1 ps-6 pe-14 text-sm font-medium text-primary-foreground transition-all duration-500 hover:ps-14 hover:pe-6 ${className ?? ""}`}
      {...props}
    >
      <span className="relative z-10 transition-all duration-500">{children}</span>
      <span className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
        <ArrowUpRight size={16} />
      </span>
    </button>
  );
}
