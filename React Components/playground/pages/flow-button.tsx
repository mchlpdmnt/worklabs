import { Geist } from "next/font/google";
import { FlowButton } from "@registry/flow-button/flow-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function FlowButtonDemo() {
  return (
    <div className={`${geistSans.className} min-h-screen font-sans`}>
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            FlowButton
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            registry/flow-button — hover to send the arrows flowing through the capsule.
          </p>
        </header>

        <div className="rounded-3xl bg-white p-12 shadow-sm">
          <FlowButton text="View Menu" onClick={() => window.alert("Button clicked")} />
        </div>

      </main>
    </div>
  );
}
