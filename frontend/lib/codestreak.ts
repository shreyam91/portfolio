"use client";

import { usePathname } from "next/navigation";

/**
 * codestreak — shared helpers for the CodeStreak area.
 *
 * `useCodeStreakBasePath` mirrors the DashboardNavbar rewrite convention so all
 * section/detail links stay correct on both the main domain (`/codestreak/...`)
 * and the codestreak.shreyam.online subdomain (pathname has no `/codestreak`
 * prefix because middleware rewrites it internally).
 */

export function useCodeStreakBasePath(): string {
  const pathname = usePathname();
  return pathname.startsWith("/codestreak") ? "/codestreak" : "";
}

/** Title → slug, matching the id-matching done in the detail pages. */
export function toSlug(title?: string): string {
  return (title ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Compact date formatter for "date" strings like "September 7, 2026". */
export function formatDate(value?: string): string {
  if (!value) return "";
  return value;
}
