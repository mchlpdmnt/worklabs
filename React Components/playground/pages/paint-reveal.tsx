import { Geist } from "next/font/google";
import { PaintReveal } from "@registry/paint-reveal/paint-reveal";

const geist = Geist({ subsets: ["latin"] });

export default function PaintRevealDemo() {
  return <main className={`${geist.className} grid min-h-[100dvh] place-items-center bg-black p-5 sm:p-10`}>
    <PaintReveal className="min-h-[min(78dvh,720px)] w-full max-w-6xl" brushSize={88}>
      <div><p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Worklabs experiment 014</p><h1 className="mt-4 text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.82] tracking-[-0.07em]">Found<br />beneath.</h1></div>
    </PaintReveal>
  </main>;
}
