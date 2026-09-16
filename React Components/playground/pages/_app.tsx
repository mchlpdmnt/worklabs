import "@/styles/globals.css";
import "lenis/dist/lenis.css";
import type { AppProps } from "next/app";
import { AnimatePresence } from "motion/react";
import { DemoCanvas } from "@/components/demo-canvas";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <DemoCanvas><AnimatePresence mode="wait">
      <Component key={router.route} {...pageProps} />
    </AnimatePresence></DemoCanvas>
  );
}
