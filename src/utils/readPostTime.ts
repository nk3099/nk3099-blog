
// src/utils/readPostTime.ts

export type RoundingMode = "round" | "ceil" | "floor";

export interface ReadTimeResult {
  minutes: number; // >= 1 when words > 0
  words: number;
  label: string;   // e.g., "3min read"
}

/** Remove inline/fenced code and HTML tags before counting words. */
export function sanitizeForWordCount(input: string): string {
  if (!input) return "";
  return input
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, "")  // strip inline/fenced code
    .replace(/<\/?[^>]+(>|$)/g, "")        // strip HTML tags defensively
    .replace(/\s+/g, " ")                  // normalize whitespace
    .trim();
}

/** Count words from sanitized text. */
export function countWords(text: string): number {
  const clean = sanitizeForWordCount(text);
  if (!clean) return 0;
  return clean.split(/\s+/).filter(Boolean).length;
}

/** Format label: "3min read" (no type appended). */

export function formatReadTimeLabel(minutes: number): string {
    if (minutes <= 1) {
      return ` 1 min read`;
    } else {
      return ` ${minutes} mins read`;
    }
  }
  
/**
 * Compute reading time from raw markdown/text.
 *
 * @param body Raw markdown or text content (e.g., `post.body`).
 * @param wpm Words per minute (default 225; common: 200–250).
 * @param rounding Rounding strategy: "round" | "ceil" | "floor" (default "round").
 * @returns { minutes, words, label } → label like "3min read".
 */
export function getReadTime(
  body: string,
  wpm: number = 225,
  rounding: RoundingMode = "round"
): ReadTimeResult {
  const words = countWords(body);
  const rawMinutes = wpm > 0 ? words / wpm : 0;

  let minutes =
    rounding === "ceil" ? Math.ceil(rawMinutes) :
    rounding === "floor" ? Math.floor(rawMinutes) :
    Math.round(rawMinutes);

  // Ensure at least "1min read" when there is content
  if (words > 0) minutes = Math.max(1, minutes);

  return { minutes, words, label: formatReadTimeLabel(minutes) };
}

/**
 * Compute reading time from rendered HTML (if you prefer).
 */
export function getReadTimeFromHtml(
  html: string,
  wpm: number = 225,
  rounding: RoundingMode = "round"
): ReadTimeResult {
  const text = (html || "")
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return getReadTime(text, wpm, rounding);
}
