import { Geist } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@registry/magnetic-button/magnetic-button";

const geist = Geist({ subsets: ["latin"] });

export default function MagneticButtonDemo() {
  return <main className={`${geist.className} grid min-h-[100dvh] place-items-center bg-black px-6 text-white`}>
    <section className="flex flex-col items-center gap-8 text-center">
      <div><p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Move around the control</p><h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Magnetic action</h1></div>
      <MagneticButton className="gap-3">Start a project <ArrowUpRight size={17} aria-hidden /></MagneticButton>
    </section>
  </main>;
}
