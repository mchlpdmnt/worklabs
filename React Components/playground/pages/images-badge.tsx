import { Geist } from "next/font/google";
import {
  ImagesBadge,
  type BadgeImage,
} from "@registry/images-badge/images-badge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const images: BadgeImage[] = [
  {
    src: "https://picsum.photos/seed/worklabs-forest/160/160",
    alt: "Forest canopy",
  },
  {
    src: "https://picsum.photos/seed/worklabs-coast/160/160",
    alt: "Rocky coastline",
  },
  {
    src: "https://picsum.photos/seed/worklabs-city/160/160",
    alt: "City architecture",
  },
  {
    src: "https://picsum.photos/seed/worklabs-studio/160/160",
    alt: "Creative studio",
  },
  {
    src: "https://picsum.photos/seed/worklabs-desert/160/160",
    alt: "Desert landscape",
  },
  {
    src: "https://picsum.photos/seed/worklabs-lake/160/160",
    alt: "Mountain lake",
  },
];

export default function ImagesBadgeDemo() {
  return (
    <div
      className={`${geistSans.className} min-h-[100dvh] bg-black font-sans text-neutral-100`}
    >
      <main className="mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
        <header className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Images badge
          </h1>
          <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-neutral-400">
            Hover over each badge to fan out the image stack and reveal hidden
            thumbnails.
          </p>
        </header>

        <section
          aria-label="Image badge examples"
          className="mt-16 flex flex-col items-start gap-12 border-y border-white/15 py-14 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-16"
        >
          <ImagesBadge
            images={images}
            maxVisible={3}
            revealCount={2}
            label="Selected work"
            size="lg"
          />
          <ImagesBadge
            images={images.slice(1)}
            maxVisible={2}
            revealCount={2}
            label="Photography"
            size="md"
            shape="circle"
          />
          <ImagesBadge
            images={images.slice(2)}
            maxVisible={2}
            revealCount={1}
            label="Archive"
            size="sm"
            shape="square"
          />
        </section>

      </main>
    </div>
  );
}
