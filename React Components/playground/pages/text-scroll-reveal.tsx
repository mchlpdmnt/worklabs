import { Geist } from "next/font/google";
import { TextScrollReveal } from "@registry/text-scroll-reveal/text-scroll-reveal";

const geist = Geist({ subsets: ["latin"] });

export default function TextScrollRevealDemo() {
  return <main className={`${geist.className} grid min-h-[100dvh] place-items-center bg-black p-4 text-white sm:p-8`}>
    <section className="w-full max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-neutral-950">
      <div className="border-b border-white/15 px-6 py-4 text-xs uppercase tracking-[0.2em] text-neutral-500">Scroll inside the statement</div>
      <TextScrollReveal height={620} text="Good motion creates meaning before it creates spectacle. Every transition should clarify where you came from and where you are going next." />
    </section>
  </main>;
}
