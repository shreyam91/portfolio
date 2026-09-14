/**
 * dsaForge — display helpers for the DSAForge-powered DSA section.
 *
 * The backend stores normalized DSAForge metadata. These helpers are purely
 * presentational: strip HTML, build GitHub links, format platform labels.
 * No curated learning content lives here — only what DSAForge factually
 * produced.
 */

/** Your DSAForge output repo (the one the extension pushes solutions to). */
export const DSA_FORGE_GITHUB_BASE =
  "https://github.com/shreyam91/DSAForge-Problems";

const DSA_FORGE_BRANCH = "main";

/**
 * Where a problem's solution lives in the DSAForge output repo.
 * Prefers the stored githubPath (set by the backend import); falls back to a
 * path built from the slug.
 */
export function buildGithubUrl(params: {
  githubPath?: string;
  slug?: string;
  language?: string;
}): string | null {
  if (params.githubPath) return params.githubPath;
  if (!params.slug) return null;
  const ext = extensionFor(params.language) ?? "";
  return `${DSA_FORGE_GITHUB_BASE}/blob/${DSA_FORGE_BRANCH}/${params.slug}/solution${ext}`;
}

/** Rough language → extension map for the fallback GitHub path. */
function extensionFor(language?: string): string | null {
  if (!language) return null;
  const map: Record<string, string> = {
    java: ".java",
    python: ".py",
    python3: ".py",
    cpp: ".cpp",
    "c++": ".cpp",
    javascript: ".js",
    typescript: ".ts",
    csharp: ".cs",
    go: ".go",
    rust: ".rs",
    swift: ".swift",
    kotlin: ".kt",
  };
  const key = language.toLowerCase();
  return map[key] ?? (key === "java" ? ".java" : null);
}

/** Strip HTML tags to plain text (LeetCode descriptions are HTML). */
export function stripHtml(input?: string | null): string {
  if (!input) return "";
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Platform label, e.g. "LeetCode" | "GeeksforGeeks". */
export function platformLabel(platform?: string): string {
  return platform === "leetcode"
    ? "LeetCode"
    : platform === "gfg"
      ? "GeeksforGeeks"
      : (platform ?? "");
}

/** CTA text on the detail page's problem link. */
export function viewProblemLabel(platform?: string): string {
  return platform === "gfg"
    ? "View Problem on GeeksforGeeks"
    : "View Problem on LeetCode";
}

/**
 * Strip HTML to readable text while preserving structure: block tags become
 * line breaks and <sup>/<sub> render as ^/_ (so "10<sup>4</sup>" → "10^4"
 * rather than mangled digits). Used to parse LeetCode's inline HTML.
 */
function stripHtmlPreserve(input?: string | null): string {
  if (!input) return "";
  return input
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<sup>([\s\S]*?)<\/sup>/gi, "^$1")
    .replace(/<sub>([\s\S]*?)<\/sub>/gi, "_$1")
    .replace(/<\/(?:p|div|li|pre|h[1-6]|ul|ol|tr)>/gi, "\n")
    .replace(/<li(?:\s[^>]*)?>/gi, "\n- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&minus;/g, "−")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * LeetCode DSAForge problems embed everything — statement, examples and
 * constraints — in a single `description` HTML string, with no separate
 * `examples` / `constraints` fields. Split it into parts so each can be
 * rendered as its own section (matching the structured GFG shape).
 */
export function parseDescription(html?: string | null): {
  statement: string;
  examples: { input?: string; output?: string; explanation?: string }[];
  constraints: string[];
} {
  const empty = { statement: "", examples: [], constraints: [] };
  if (!html) return empty;

  // Cut the constraints block off (everything from "Constraints:" onward),
  // rewinding to the enclosing tag so the block structure stays intact.
  let head = html;
  let constraintsHtml = "";
  const cIdx = html.search(/Constraints\s*:/i);
  if (cIdx >= 0) {
    const start = html.lastIndexOf("<", cIdx);
    head = html.slice(0, start === -1 ? cIdx : start);
    constraintsHtml = html.slice(start === -1 ? cIdx : start);
  }

  // Everything after each "Example N" heading is one example block.
  const exampleSplit = head.split(
    /<(?:strong|b)[^>]*>\s*Example\s+\d+\s*:?\s*<\/(?:strong|b)>/i,
  );
  const statement = exampleSplit[0] ? stripHtmlPreserve(exampleSplit[0]) : "";
  const examples = exampleSplit
    .slice(1)
    .map((segment) => parseExampleBlock(segment))
    .filter((e): e is { input?: string; output?: string; explanation?: string } =>
      Boolean(e),
    );

  return { statement, examples, constraints: parseConstraints(constraintsHtml) };
}

/** Pull Input / Output / Explanation out of one LeetCode example block. */
function parseExampleBlock(
  segment: string,
): { input?: string; output?: string; explanation?: string } | null {
  if (!segment.trim()) return null;
  const text = stripHtmlPreserve(segment).replace(/[ \t]+\n/g, "\n").trim();
  const grab = (label: string) => {
    const re = new RegExp(
      `(?:^|\\n)${label}\\s*:?[ \\t]*([\\s\\S]*?)(?=\\n(?:Input|Output|Explanation|Example)\\s*:?[ \\t]*|$)`,
      "i",
    );
    const m = text.match(re);
    const val = m?.[1]?.trim();
    return val ? val : undefined;
  };
  return { input: grab("Input"), output: grab("Output"), explanation: grab("Explanation") };
}

/** Parse a `<ul>`/`<pre>` constraints block into readable lines. */
function parseConstraints(html: string): string[] {
  if (!html) return [];
  const liItems = html.match(/<li(?:\s[^>]*)?>[\s\S]*?<\/li>/gi) ?? [];
  if (liItems.length) {
    return liItems.map((li) => stripHtmlPreserve(li).trim()).filter(Boolean);
  }
  return stripHtmlPreserve(html)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Human label for a raw DSAForge status value. */
export function statusLabel(raw?: number | string): string {
  if (raw === 10 || raw === "10") return "Accepted";
  if (raw === 1 || raw === "1") return "Accepted";
  if (raw === "correct") return "Correct";
  if (raw === undefined || raw === null) return "";
  return String(raw);
}

/**
 * Format GFG's inputFormat object ({ arguments, datatype }) into readable lines.
 */
export function formatInputFormat(value?: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  const obj = value as Record<string, unknown>;
  const split = (v: unknown) =>
    typeof v === "string"
      ? v
          .split("&!//!&")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  const args = split(obj.arguments);
  const types = split(obj.datatype);
  if (!args.length && !types.length) return [];
  return args.map((name, i) =>
    types[i] ? `${types[i]} ${name}`.trim() : name,
  );
}

/**
 * Format GFG's constraints (array of { key: value } entries) into readable
 * lines. Non-string/number UI-only keys are skipped.
 */
export function formatConstraints(value?: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const rows: string[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      if (typeof entry === "string" || typeof entry === "number")
        rows.push(String(entry));
      continue;
    }
    const parts = Object.entries(entry as Record<string, unknown>)
      .filter(([k]) => !/show_in_preview|show_constraints/i.test(k))
      .map(([k, v]) =>
        typeof v === "string" || typeof v === "number" ? `${k}: ${v}` : null,
      )
      .filter(Boolean);
    if (parts.length) rows.push(parts.join(", "));
  }
  return rows;
}
