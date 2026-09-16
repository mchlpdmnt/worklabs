import { Geist } from "next/font/google";
import { ContactCard } from "@registry/contact-card/contact-card";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function ContactCardDemo() {
  return (
    <div className={`${geistSans.className} min-h-screen font-sans`}>
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            ContactCard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            registry/contact-card — hover the card (or tap it on mobile) to
            reveal the links, then hover a link for its brand gradient.
          </p>
        </header>

        <ContactCard />

      </main>
    </div>
  );
}
