import { Geist } from "next/font/google";
import { GradientPointer } from "@registry/gradient-pointer/gradient-pointer";

const geist = Geist({ subsets: ["latin"] });

export default function GradientPointerDemo() {
  return <main className={`${geist.className} grid min-h-[100dvh] place-items-center bg-black p-5 text-white sm:p-10`}>
    <GradientPointer className="flex min-h-[min(78dvh,720px)] w-full max-w-6xl items-end p-7 sm:p-12">
      <div><p className="text-xs uppercase tracking-[0.24em] text-white/60">Follow the light</p><h1 className="mt-3 max-w-3xl text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.86] tracking-[-0.06em]">Pointer<br />gradient</h1></div>
    </GradientPointer>
  </main>;
}
