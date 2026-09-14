"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * CodeStreakNav — quiet sticky navigation for the CodeStreak practice area,
 * restyled to match the portfolio GlobalHeader (mono, minimal, scroll-blur).
 *
 * Preserves the subdomain rewrite: on the main domain the pathname is
 * `/codestreak/...` (basePath "/codestreak"); on codestreak.shreyam.online the
 * middleware strips that prefix internally, so pathname is `/...` (basePath "").
 */

const LINKS = [
  { label: "DSA", href: "dsa" },
  { label: "System Design", href: "system-design" },
  { label: "Machine Coding", href: "machine-coding" },
  { label: "Blogs", href: "blogs" },
  { label: "Resources", href: "resources" },
];

export function CodeStreakNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isMainDomain = pathname.startsWith("/codestreak");
  const basePath = isMainDomain ? "/codestreak" : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === `${basePath}/${href}` ||
    pathname.startsWith(`${basePath}/${href}/`);

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled
          ? "bg-[#fcfcfc]/85 dark:bg-[#0a0a0a]/75 backdrop-blur-md border-b border-gray-200/60 dark:border-white/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Wordmark */}
        <Link
          href={`${basePath || "/"}`}
          className="flex items-center gap-2 text-[#1a1a1a] dark:text-[#fcfcfc]"
          aria-label="CodeStreak — back to dashboard"
        >
          <span className="font-mono text-sm tracking-[0.18em] font-medium">
            CODESTREAK
          </span>
          <span className="hidden sm:inline text-[#3b82f6] font-mono text-sm font-medium">
            · PRACTICE VAULT
          </span>
        </Link>

        {/* Section links */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-7"
          aria-label="CodeStreak sections"
        >
          {LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={`${basePath}/${link.href}`}
                className={`group relative text-sm font-light transition-colors ${
                  active
                    ? "text-[#1a1a1a] dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-1 h-px bg-[#3b82f6] transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Back to portfolio + theme */}
        <div className="flex items-center gap-3 shrink-0">
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
