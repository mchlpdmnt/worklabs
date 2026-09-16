import { Geist } from "next/font/google";
import { ButtonWithIcon } from "@registry/button-with-icon/button-with-icon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function ButtonWithIconDemo() {
  return (
    <div className={`${geistSans.className} min-h-screen font-sans`}>
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            ButtonWithIcon
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            registry/button-with-icon — hover to move the arrow to the leading edge.
          </p>
        </header>

        <div className="rounded-3xl bg-white p-12 shadow-sm">
          <ButtonWithIcon onClick={() => window.alert("Button clicked")}>Let's Collaborate</ButtonWithIcon>
        </div>

      </main>
    </div>
  );
}
