import { Geist } from "next/font/google";
import {
  CurvedMenu,
  type CurvedMenuItem,
} from "@registry/curved-menu/curved-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const menuItems: CurvedMenuItem[] = [
  { title: "Home", href: "/curved-menu/", target: "home" },
  { title: "About", href: "/curved-menu/#about", target: "about" },
  { title: "Contacts", href: "/curved-menu/#contacts", target: "contacts" },
];

export default function CurvedMenuDemo() {
  return (
    <div
      className={`${geistSans.className} curved-menu-demo min-h-[100dvh] bg-black font-sans text-neutral-100`}
    >
      <main id="home" className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 sm:py-10">
        <header id="about" className="max-w-2xl py-20 sm:py-28">
          <h1 className="text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
            Curved menu
          </h1>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-neutral-400 sm:text-lg">
            Move across the burger to feel its magnetic response, then open the
            curved navigation drawer.
          </p>
        </header>

        <p id="contacts" className="max-w-md border-t border-white/20 pt-5 text-sm leading-relaxed text-neutral-400">
          The drawer traps keyboard focus, closes with Escape, follows the
          current route, and honors reduced-motion preferences.
        </p>
      </main>

      <CurvedMenu
        items={menuItems}
        homepagePath="/curved-menu"
        revealAfterTarget={null}
        navigationLabel="Preview navigation"
      />
    </div>
  );
}
