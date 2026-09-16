"use client";

import * as React from "react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------ Brand icons ------------------------------ */
/* All use `fill-current` so the wrapper's text color drives them. */

const FacebookIcon = () => (
  <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
  </svg>
);

/** Default "hover me" affordance — a cursor arrow, shown until engaged. */
const CursorIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
  </svg>
);

/* --------------------------------- Types --------------------------------- */

export interface ContactLink {
  href: string;
  /** Accessible name, e.g. "Facebook" */
  label: string;
  icon: React.ReactNode;
  /** Tailwind class for the brand gradient revealed on hover */
  brandClassName: string;
  /** Stagger for the cascade, e.g. "0.1s" */
  delay?: string;
}

export interface ContactCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  /** Smaller line under the title; pass "" to hide */
  subtitle?: string;
  links?: ContactLink[];
  /** Affordance shown bottom-right at rest, fading out once engaged.
   *  Defaults to a cursor arrow; pass `null` to hide. */
  indicator?: React.ReactNode;
}

/* ------------------------------- Defaults -------------------------------- */

/* Softened brand ramps — lighter, less saturated tints of each brand, with a
   mid stop on the two-colour ones so the blend reads gently rather than as a
   hard sweep between two ends. */
export const defaultContactLinks: ContactLink[] = [
  {
    href: "#",
    label: "Facebook",
    icon: <FacebookIcon />,
    brandClassName:
      "bg-[linear-gradient(135deg,#5B9BF5_0%,#74B8FA_50%,#8FD3FF_100%)]",
  },
  {
    href: "#",
    label: "Instagram",
    icon: <InstagramIcon />,
    brandClassName:
      "bg-[linear-gradient(45deg,#FDE3A7_0%,#FBAB7A_25%,#E2839F_55%,#B07FD0_78%,#8F97E3_100%)]",
    delay: "0.1s",
  },
  {
    href: "#",
    label: "LinkedIn",
    icon: <LinkedInIcon />,
    brandClassName:
      "bg-[linear-gradient(135deg,#4C93D6_0%,#67B3E7_50%,#86D2F7_100%)]",
    delay: "0.2s",
  },
  {
    href: "#",
    label: "GitHub",
    icon: <GitHubIcon />,
    brandClassName:
      "bg-[linear-gradient(135deg,#6E6E7C_0%,#877CA4_50%,#A08FCB_100%)]",
    delay: "0.3s",
  },
];

/* ------------------------------- Sub-parts ------------------------------- */

function ContactPanel({
  link,
  size,
  delayIn,
  delayOut,
}: {
  link: ContactLink;
  size: number;
  /** stagger used while revealing (largest panel first) */
  delayIn: string;
  /** stagger used while retracting (smallest panel first) */
  delayOut: string;
}) {
  return (
    <a
      href={link.href}
      aria-label={link.label}
      onClick={(e) => e.stopPropagation()}
      style={
        {
          width: `${size}%`,
          height: `${size}%`,
          "--d-in": delayIn,
          "--d-out": delayOut,
        } as React.CSSProperties
      }
      className={cn(
        // Only the top-right corner rounds. The panels are anchored past the
        // card's bottom-left, so that's the sole corner sitting inside the
        // card; squaring the other three lets each panel's top edge run
        // straight to the left and its right edge straight down to the base.
        "group/panel absolute bottom-[-1px] left-[-1px] overflow-hidden rounded-tr-2xl",
        // Frosted look WITHOUT backdrop-filter. These panels overlap, so a
        // backdrop-blur on each one chains four dependent blur passes that
        // re-run every animation frame — the dominant cost on hover, and what
        // made screen capture choke. A translucent gradient reads the same.
        "border-t-2 border-r border-white/70",
        "bg-[linear-gradient(135deg,rgba(255,255,255,0.44)_0%,rgba(255,255,255,0.24)_100%)]",
        "shadow-[-5px_5px_14px_0px_rgba(0,0,0,0.3)]",
        // parked off the bottom-left corner; slides home on reveal.
        // transform only — never `bottom`/`left`, which relayout each frame.
        "-translate-x-full translate-y-full transition-transform duration-700 ease-in-out will-change-transform",
        "group-hover:translate-x-0 group-hover:translate-y-0",
        "group-data-[expanded=true]:translate-x-0 group-data-[expanded=true]:translate-y-0",
        // A transition uses the delay declared on the state it is moving TO,
        // so the base rule carries the retract stagger and the hover rule the
        // reveal stagger — letting the two directions run in opposite order.
        "delay-[var(--d-out)]",
        "group-hover:delay-[var(--d-in)] group-data-[expanded=true]:delay-[var(--d-in)]",
      )}
    >
      {/* brand gradient layer — background-image isn't animatable, so the
          colour is a separate layer whose opacity transitions */}
      <span
        style={{ borderRadius: "inherit" }}
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out",
          // desktop: this panel's own hover
          "group-hover/panel:opacity-100",
          // touch: hover never fires, and tapping a panel navigates — so the
          // colours come up together when the card is tapped open, each one
          // timed to its panel via the stagger vars inherited from it
          "group-data-[expanded=true]:opacity-100 group-data-[expanded=true]:delay-[var(--d-in)]",
          link.brandClassName,
        )}
      />
      {/* icon, upper-right */}
      <span className="absolute right-3 top-2.5 z-10 text-white drop-shadow-sm transition-transform duration-500 group-hover/panel:scale-110 [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:fill-current">
        {link.icon}
      </span>
    </a>
  );
}

/* ------------------------------- Component ------------------------------- */

export function ContactCard({
  title = "Contact me",
  subtitle = "Let's work together",
  links = defaultContactLinks,
  indicator = <CursorIcon />,
  className,
  onClick,
  ...props
}: ContactCardProps) {
  // Tailwind gates `group-hover:` behind `@media (hover: hover)`, so on touch
  // devices the panels would never slide in. There, tapping the card reveals.
  const [canHover, setCanHover] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Largest panel first, tapering to the smallest — later panels sit on top by
  // DOM order, which produces the nested cascade. The top size is held to 68%
  // so the tallest panel clears the title block instead of crowding it.
  const span = links.length > 1 ? 40 / (links.length - 1) : 0;

  // Alignment is animated with transforms rather than by switching
  // `text-align`: that property isn't animatable, and flipping it mid-travel
  // forces the drop-shadowed text to re-rasterise on an animating layer, which
  // reads as a hard cut. Instead each line slides right by the slack between
  // its own width and the widest line, so left-flush eases into right-flush.
  const titleRef = React.useRef<HTMLDivElement>(null);
  const subRef = React.useRef<HTMLDivElement>(null);
  const [shift, setShift] = React.useState({ title: 0, sub: 0 });

  React.useEffect(() => {
    const measure = () => {
      const tw = titleRef.current?.offsetWidth ?? 0;
      const sw = subRef.current?.offsetWidth ?? 0;
      const widest = Math.max(tw, sw);
      setShift({ title: widest - tw, sub: widest - sw });
    };
    measure();
    window.addEventListener("resize", measure);
    // re-measure once webfonts swap in, since metrics change
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [title, subtitle]);

  return (
    <div
      data-expanded={expanded ? "true" : "false"}
      aria-expanded={canHover ? undefined : expanded}
      onClick={(e) => {
        if (!canHover) setExpanded((v) => !v);
        onClick?.(e);
      }}
      className={cn(
        "group relative isolate h-[15.5rem] w-[11.5rem] overflow-hidden rounded-[30px] sm:h-[16.5rem] sm:w-[12.5rem]",
        // monochrome gradient body
        "bg-[linear-gradient(135deg,#27272a_0%,#18181b_32%,#0c0c0e_66%,#000000_100%)]",
        "shadow-xl ring-1 ring-white/10 transition-transform duration-300 ease-out",
        "hover:-translate-y-1 data-[expanded=true]:-translate-y-1",
        !canHover && "cursor-pointer",
        className,
      )}
      {...props}
    >
      {/* lighter monochrome ramp that fades in on reveal — background-image
          isn't animatable, so lightening is a layer whose opacity transitions */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#3f3f46_0%,#27272a_32%,#18181b_66%,#0c0c0e_100%)] opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 group-data-[expanded=true]:opacity-100" />

      {/* soft monochrome sheen */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,0.18)_0%,transparent_58%)]" />

      {/* Title block. Rests centre-left; travels to the top-right corner on
          the panels' timing, clearing the space they fill. The block is
          shrink-wrapped (`w-fit`) and the lines are `nowrap`, so its width
          equals the text — that's what makes the x-offset land the text
          itself flush right rather than parking a wide box there. */}
      <div
        className={cn(
          // 12px inset on both sides; x-travel = cardWidth - 2*12 - blockWidth.
          "pointer-events-none absolute left-3 top-3 z-20 w-fit",
          "transition-transform duration-700 ease-in-out will-change-transform",
          "translate-y-[93px] sm:translate-y-[101px]",
          "group-hover:translate-x-[60px] group-hover:translate-y-0",
          "group-data-[expanded=true]:translate-x-[60px] group-data-[expanded=true]:translate-y-0",
          "sm:group-hover:translate-x-[76px] sm:group-data-[expanded=true]:translate-x-[76px]",
          // Leads on the way in, trails on the way out: no delay heading into
          // the hovered state, but on the way back it waits for every panel to
          // have started retracting (last panel starts at 0.3s) before moving.
          "delay-[400ms] group-hover:delay-0 group-data-[expanded=true]:delay-0",
        )}
      >
        <div
          ref={titleRef}
          style={{ "--shift": `${shift.title}px` } as React.CSSProperties}
          className="w-fit whitespace-nowrap text-lg font-semibold leading-tight tracking-tight text-white transition-transform delay-[400ms] duration-700 ease-in-out group-hover:translate-x-[var(--shift)] group-hover:delay-0 group-data-[expanded=true]:translate-x-[var(--shift)] group-data-[expanded=true]:delay-0"
        >
          {title}
        </div>
        {subtitle && (
          <div
            ref={subRef}
            style={{ "--shift": `${shift.sub}px` } as React.CSSProperties}
            className="mt-0.5 w-fit whitespace-nowrap text-[11px] leading-tight text-white/70 transition-transform delay-[400ms] duration-700 ease-in-out group-hover:translate-x-[var(--shift)] group-hover:delay-0 group-data-[expanded=true]:translate-x-[var(--shift)] group-data-[expanded=true]:delay-0"
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* hover affordance, bottom-right — fades out once the card is engaged */}
      {indicator && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 z-20 text-white transition-opacity duration-500 ease-in-out group-hover:opacity-0 group-data-[expanded=true]:opacity-0 [&_svg]:h-6 [&_svg]:w-6"
        >
          {indicator}
        </div>
      )}

      {links.map((link, i) => (
        <ContactPanel
          key={link.label ?? i}
          link={link}
          size={68 - i * span}
          delayIn={link.delay ?? "0s"}
          // mirrored stagger: the last panel in retracts first, so the
          // cascade unwinds in the order it was built rather than repeating it
          delayOut={links[links.length - 1 - i]?.delay ?? "0s"}
        />
      ))}
    </div>
  );
}
