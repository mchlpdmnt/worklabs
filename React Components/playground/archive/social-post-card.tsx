// Unpublished example retained outside the Pages Router's exported routes.
import { Poppins } from "next/font/google";
import type { CSSProperties } from "react";
import { SocialPostCard } from "@registry/social-post-card/social-post-card";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const lightTokens = {
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.145 0 0)",
  "--card": "oklch(1 0 0)",
  "--muted-foreground": "oklch(0.556 0 0)",
} as CSSProperties;

export default function SocialPostCardDemo() {
  return (
    <div style={lightTokens} className={`${poppins.className} min-h-screen bg-white font-sans text-foreground`}>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-14 px-6 py-16">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            SocialPostCard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            registry/social-post-card — a chrome-less post card with a gentle
            hover lift.
          </p>
        </header>

        <SocialPostCard
          className="max-w-80 rounded-lg border border-border bg-card p-4 shadow"
          imageUrl="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&h=800&auto=format&fit=crop&q=60"
          imageAlt="Designer sketching interface flows"
          title="Color Psychology in UI: How to Choose the Right Palette"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."
          category="UI/UX design"
        />

      </main>
    </div>
  );
}
