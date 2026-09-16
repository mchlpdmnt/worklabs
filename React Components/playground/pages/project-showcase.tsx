import { Geist } from "next/font/google";
import {
  ProjectShowcase,
  type ProjectShowcaseItem,
} from "@registry/project-showcase/project-showcase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const projects: ProjectShowcaseItem[] = [
  {
    title: "Curved navigation",
    description: "A magnetic burger and route-aware navigation drawer.",
    year: "2026",
    image: "https://picsum.photos/seed/curved-navigation/1200/750",
    link: "#projects",
  },
  {
    title: "Image collection badge",
    description: "A compact stack that reveals more imagery on hover.",
    year: "2026",
    image: "https://picsum.photos/seed/image-collection/1200/750",
    link: "#projects",
  },
  {
    title: "Directional action",
    description: "A tactile button with an animated leading icon.",
    year: "2026",
    image: "https://picsum.photos/seed/directional-action/1200/750",
    link: "#projects",
  },
];

export default function ProjectShowcaseDemo() {
  return (
    <div
      className={`${geistSans.className} project-demo min-h-[100dvh] bg-black font-sans text-neutral-100`}
    >
      <main id="projects" className="min-h-[100dvh] pt-16 sm:pt-24">
        <header className="mx-auto w-full max-w-[1200px] px-6 pb-16 sm:px-10 sm:pb-20 lg:px-12">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Project showcase
          </h1>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-neutral-400">
            Hover over a project on desktop for a pointer-following preview. On
            smaller screens, each preview stays inline.
          </p>
        </header>

        <ProjectShowcase projects={projects} />

      </main>
    </div>
  );
}
