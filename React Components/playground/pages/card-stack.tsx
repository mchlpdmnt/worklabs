import { Geist } from "next/font/google";
import { CardStack, type CardStackItem } from "@registry/card-stack/card-stack";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const items: CardStackItem[] = [
  {
    id: 1,
    title: "Aurora over Lofoten",
    description: "Northern lights dancing above the Norwegian fjords.",
    details:
      "Above the Arctic Circle, the Lofoten archipelago pairs jagged peaks with mirror-still fjords. Between September and April, solar winds paint the night sky green and violet. It is best watched from a beachside cabin with no city lights for miles.",
    imageSrc: "https://picsum.photos/id/1015/1040/640",
    href: "https://example.com/aurora",
    tag: "Norway",
  },
  {
    id: 2,
    title: "Desert Dunes",
    description: "Golden hour across endless sand ridges.",
    details:
      "Wind-carved ridges stretch to the horizon, shifting a few meters every year. Arrive an hour before sunset: the low sun turns the sand from pale gold to deep amber, and the dune crests throw knife-sharp shadows across the valleys.",
    imageSrc: "https://picsum.photos/id/1016/1040/640",
    href: "https://example.com/dunes",
    tag: "Sahara",
  },
  {
    id: 3,
    title: "Forest Trail",
    description: "Mist rolling through an old-growth canopy.",
    details:
      "A single-track path winds beneath trees older than most countries. Morning fog clings to the moss until mid-day, muffling every footstep. Bring a flask, take the long loop, and let the canopy close over you.",
    imageSrc: "https://picsum.photos/id/1018/1040/640",
    href: "https://example.com/forest",
    tag: "Pacific Northwest",
  },
];

export default function CardStackDemo() {
  return (
    <div className={`${geistSans.className} min-h-[100dvh] overflow-x-clip font-sans`}>
      <main className="mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col justify-center gap-10 px-6 py-16">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            CardStack
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Click the center card to flip it, drag it to
            swipe, or click a side card.
          </p>
        </header>

        <CardStack items={items} loop showDots={false} />
      </main>
    </div>
  );
}
