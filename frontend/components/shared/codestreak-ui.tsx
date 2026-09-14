"use client";

import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";

/**
 * codestreak-ui — small, theme-consistent building blocks shared across the
 * CodeStreak pages (portfolio design language: mono eyebrows, #3b82f6 accent,
 * soft bordered cards, EASE reveals).
 */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Mono uppercase section label for detail-page blocks. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="block mb-4 text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
      {children}
    </span>
  );
}

/** Mono pill used for tags / chips. */
export function TagPill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-gray-200 dark:border-white/10 px-2.5 py-1 text-[11px] font-mono text-gray-600 dark:text-gray-400 ${className}`}
    >
      {children}
    </span>
  );
}

/** Difficulty badge — Easy/Medium/Hard, null-safe. */
export function DifficultyBadge({
  difficulty,
}: {
  difficulty?: string;
}): ReactNode {
  if (!difficulty) return null;
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest";
  const map: Record<string, string> = {
    Easy: "text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/5",
    Medium:
      "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5",
    Hard: "text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/5",
  };
  const tone =
    map[difficulty] ??
    "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400";
  return <span className={`${base} ${tone}`}>{difficulty}</span>;
}

/** Eyebrow + serif-italic heading + subtitle, with motion reveal. */
export function PageHeader({
  eyebrow,
  title,
  titleAccent,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
      className="mt-10 mb-12 max-w-2xl"
    >
      <span className="mb-5 block text-xs font-mono uppercase tracking-[0.3em] text-[#3b82f6]">
        {eyebrow}
      </span>
      <h1 className="text-3xl md:text-5xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
        {title}{" "}
        {titleAccent && (
          <span className="font-serif italic text-[#3b82f6]">
            {titleAccent}
          </span>
        )}
      </h1>
      {subtitle && (
        <p className="mt-6 text-base md:text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/** Dashboard overview statistic. */
export function Stat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] px-5 py-4">
      <div className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc]">
        {value}
      </div>
      <div className="mt-1 text-[11px] font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </div>
  );
}

/** Copy-to-clipboard button that flips to a "Copied" check briefly. */
export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          // Clipboard may be unavailable (non-secure context) — ignore.
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors ${copied ? "text-emerald-500" : "text-gray-400 hover:text-gray-100"} ${className}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}
