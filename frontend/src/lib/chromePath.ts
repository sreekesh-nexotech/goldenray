import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

/**
 * The Chrome/Chromium binary the quotation PDF routes launch.
 *
 * In Docker the image installs Chromium and sets PUPPETEER_EXECUTABLE_PATH, so
 * that always wins. Running `next dev` outside Docker there is no such
 * variable, and the container's /usr/bin/chromium-browser rarely exists on a
 * developer machine — so look for a locally installed browser instead of
 * failing every PDF request.
 */
const SYSTEM_CANDIDATES = [
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/snap/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];

/** Newest Chromium that Playwright downloaded into its cache, if any. */
function playwrightChromium(): string | undefined {
  const cache = path.join(homedir(), ".cache", "ms-playwright");
  if (!existsSync(cache)) return undefined;
  const builds = readdirSync(cache)
    .filter((name) => /^chromium-\d+$/.test(name))
    .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));
  for (const build of builds) {
    for (const rel of [
      "chrome-linux64/chrome",
      "chrome-linux/chrome",
      "chrome-mac/Chromium.app/Contents/MacOS/Chromium",
      "chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium",
    ]) {
      const candidate = path.join(cache, build, rel);
      if (existsSync(candidate)) return candidate;
    }
  }
  return undefined;
}

export function resolveChromePath(): string {
  const configured = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (configured) return configured;

  const found = SYSTEM_CANDIDATES.find((p) => existsSync(p)) ?? playwrightChromium();
  if (found) return found;

  throw new Error(
    "No Chrome/Chromium found for quotation PDF rendering. Install Chrome or " +
      "Chromium, or set PUPPETEER_EXECUTABLE_PATH to its binary.",
  );
}
