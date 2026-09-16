import { Check, Copy } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  label: string;
  accessibleLabel?: string;
  className?: string;
  onCopy: () => Promise<boolean>;
}

export function CopyButton({ label, accessibleLabel, className, onCopy }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copy = async () => {
    window.clearTimeout(resetTimer.current);
    setState("copying");
    try {
      setState(await onCopy() ? "copied" : "error");
    } catch {
      setState("error");
    }
    resetTimer.current = window.setTimeout(() => setState("idle"), 1800);
  };

  return (
    <button
      type="button"
      className={className}
      onClick={copy}
      disabled={state === "copying"}
      aria-label={accessibleLabel ?? label}
      aria-busy={state === "copying"}
      title={accessibleLabel ?? label}
    >
      {state === "copied" ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
      {state === "copied" ? "Copied" : state === "copying" ? "Copying…" : state === "error" ? "Try again" : label}
    </button>
  );
}
