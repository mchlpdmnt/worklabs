import { Geist } from "next/font/google";
import Link from "next/link";

const geistSans = Geist({ subsets: ["latin"] });

const demos = [
  { href: "/blog-card", label: "BlogCard" },
  { href: "/button-with-icon", label: "ButtonWithIcon" },
  { href: "/card-stack", label: "CardStack" },
  { href: "/contact-card", label: "ContactCard" },
  { href: "/curve", label: "CurvePageTransition" },
  { href: "/curved-menu", label: "CurvedMenu" },
  { href: "/flow-button", label: "FlowButton" },
  { href: "/images-badge", label: "ImagesBadge" },
  { href: "/landing-greet", label: "LandingGreet" },
  { href: "/project-showcase", label: "ProjectShowcase" },
];

export default function PlaygroundIndex() {
  return (
    <main className={`${geistSans.className} mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col justify-center gap-8 px-6 py-16`}>
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Component playground</h1>
        <p className="mt-3 text-sm text-muted-foreground">Each component has its own isolated demo. This collection hub is not embedded in registry previews.</p>
      </header>
      <nav aria-label="Component demos" className="grid gap-4 sm:grid-cols-2">
        {demos.map((demo) => (
          <Link key={demo.href} href={demo.href} className="w-fit text-sm underline underline-offset-4 transition hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {demo.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
