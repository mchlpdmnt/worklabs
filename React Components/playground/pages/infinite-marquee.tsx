import { Geist } from "next/font/google";
import { InfiniteMarquee } from "@registry/infinite-marquee/infinite-marquee";

const geist = Geist({ subsets: ["latin"] });

export default function InfiniteMarqueeDemo() {
  return <main className={`${geist.className} flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-black text-white`}>
    <p className="mx-auto mb-10 w-full max-w-5xl px-6 text-xs uppercase tracking-[0.24em] text-neutral-500">Scroll in either direction</p>
    <InfiniteMarquee items={["Motion", "Direction", "Rhythm", "Worklabs"]} className="text-[clamp(3rem,10vw,9rem)] font-semibold leading-none tracking-[-0.06em]" />
  </main>;
}
