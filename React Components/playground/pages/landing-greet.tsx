import { Geist } from "next/font/google";
import { LandingGreet } from "@registry/landing-greet/landing-greet";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function LandingGreetDemo() {
  return (
    <div className={`${geistSans.className} font-sans text-zinc-100`}>
      <LandingGreet backgroundColor="black" curveColor="#262626">
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            LandingGreet
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            registry/landing-greet — the greeting cycles, then sweeps up once
            on load. Reload the page to replay it.
          </p>
        </header>

        </main>
      </LandingGreet>
    </div>
  );
}
