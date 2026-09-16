import { Geist } from "next/font/google";
import Link from "next/link";
import { CurvePageTransition } from "@registry/curve-page-transition/curve-page-transition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const demoRoutes = {
  "/curve": "Home",
  "/curve/about": "About",
  "/curve/works": "Works",
  "/curve/contact": "Contact",
};

const links = [
  { href: "/curve", label: "Home" },
  { href: "/curve/about", label: "About" },
  { href: "/curve/works", label: "Works" },
  { href: "/curve/contact", label: "Contact" },
];

export function CurveDemo({ label }: { label: string }) {
  return (
    <div className={`${geistSans.className} font-sans text-zinc-100`}>
      <CurvePageTransition routes={demoRoutes} backgroundColor="black" curveColor="#262626">
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16">
          <header className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              CurvePageTransition
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              registry/curve-page-transition — click a link and watch the curve
              sweep between pages.
            </p>
          </header>

          <p className="text-xl">
            You are at <span className="font-semibold">{label}</span>
          </p>

          <nav className="flex items-center gap-3 text-lg">
            {links.map((l, i) => (
              <span key={l.href} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden="true">•</span> : null}
                <Link
                  href={l.href}
                  className="underline underline-offset-4 transition hover:text-zinc-400"
                >
                  {l.label}
                </Link>
              </span>
            ))}
          </nav>

        </main>
      </CurvePageTransition>
    </div>
  );
}
