"use client";

import * as React from "react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export interface SocialPostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  /** Small accent label under the title, e.g. "UI/UX design" */
  category?: string;
  /** Optional paragraph under the title — pairs well with boxed chrome
   *  (`className="bg-card rounded-lg p-4 shadow"`) for a filled card look */
  description?: string;
}

export const SocialPostCard = React.forwardRef<HTMLDivElement, SocialPostCardProps>(
  ({ imageUrl, imageAlt = "", title, category, description, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group w-full transition duration-300 ease-out hover:-translate-y-0.5",
          className,
        )}
        {...props}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="aspect-[3/2] w-full rounded-xl object-cover"
        />
        <h3 className="mt-3 text-base font-medium text-foreground">{title}</h3>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {category && (
          <p className={cn("text-xs font-medium text-indigo-600 dark:text-indigo-400", description ? "mt-2" : "mt-1")}>
            {category}
          </p>
        )}
      </div>
    );
  },
);
SocialPostCard.displayName = "SocialPostCard";

export interface SocialPostCardGridProps extends React.HTMLAttributes<HTMLElement> {
  posts: SocialPostCardProps[];
  /** Section heading (default "Latest Blog"); pass "" to hide */
  heading?: string;
  /** Line under the heading; pass "" to hide */
  description?: string;
}

export function SocialPostCardGrid({
  posts,
  heading = "Latest Blog",
  description = "Stay ahead of the curve with fresh content on code, design, startups, and everything in between.",
  className,
  ...props
}: SocialPostCardGridProps) {
  return (
    <section className={cn("flex w-full flex-col items-center", className)} {...props}>
      {heading && (
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          {heading}
        </h2>
      )}
      {description && (
        <p className="mt-2 max-w-lg text-center text-sm text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-8">
        {posts.map((post, i) => (
          <SocialPostCard key={`${post.title}-${i}`} className="max-w-72" {...post} />
        ))}
      </div>
    </section>
  );
}
