/**
 * track — lightweight, dependency-free conversion tracking.
 *
 * Pushes named events to a Google Tag Manager / GA4 `dataLayer` when one
 * exists. Inert everywhere else — no build of anything is required, and a
 * missing dataLayer is never an error. All calls are no-ops in environments
 * without tracking, so wiring events costs nothing.
 */

type EventName =
  | "hero_cta"
  | "explore_work"
  | "open_case_study"
  | "view_live"
  | "view_code"
  | "click_social"
  | "contact_email"
  | "live_project_visit"
  | "live_project_code";

export function track(name: EventName, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: unknown[];
  };
  if (!Array.isArray(w.dataLayer)) return;
  w.dataLayer.push({ event: name, ...params });
}
