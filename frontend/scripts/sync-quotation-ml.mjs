#!/usr/bin/env node
/**
 * Rebuild the Malayalam block of the quotation string catalog from the
 * translation checklist.
 *
 *   node scripts/sync-quotation-ml.mjs
 *
 * Reads the Malayalam column of `malayalam-checklist.md` and writes the `ml`
 * object in `quotationStrings.ts`, between the `// ml:start` / `// ml:end`
 * markers. A blank cell means "keep the English string"; the literal
 * `((remove))` means "render nothing there in Malayalam".
 *
 * Arrays are emitted whole (translated items merged over the English ones),
 * because the catalog merges a translation one page key at a time.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const I18N_DIR = path.join(process.cwd(), "src/components/Quotation/i18n");
const CATALOG = path.join(I18N_DIR, "quotationStrings.ts");
const CHECKLIST = path.join(I18N_DIR, "malayalam-checklist.md");
const REMOVE_MARKER = "((remove))";

/** Evaluate the `en` literal out of the TypeScript catalog. */
async function loadEnglish() {
  const src = fs.readFileSync(CATALOG, "utf8");
  const start = src.indexOf("const en = {");
  const end = src.indexOf("\n};\n", start);
  if (start === -1 || end === -1) throw new Error("could not locate `en` in the catalog");
  const body = src.slice(start, end + 3).replace("const en = {", "export const en = {");
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "qml-")), "en.mjs");
  fs.writeFileSync(tmp, body + "\n");
  const { en } = await import(pathToFileURL(tmp).href);
  return en;
}

/** `page4.comparisonRows[0].label` -> ["page4", "comparisonRows", 0, "label"] */
function parseKeyPath(key) {
  return key
    .split(".")
    .flatMap((part) => {
      const m = part.match(/^([^[]+)((\[\d+\])*)$/);
      if (!m) throw new Error(`unparseable key: ${key}`);
      const indices = [...m[2].matchAll(/\[(\d+)\]/g)].map((i) => Number(i[1]));
      return [m[1], ...indices];
    });
}

function readTranslations() {
  const rows = fs.readFileSync(CHECKLIST, "utf8").split("\n");
  const out = new Map();
  for (const line of rows) {
    const m = line.match(/^\|\s(page\w+\.\S*)\s\|(.*)\|(.*)\|\s*$/);
    if (!m) continue;
    const [, key, , malayalam] = m;
    const value = malayalam.trim();
    if (!value) continue;
    out.set(key, value === REMOVE_MARKER ? "" : value);
  }
  return out;
}

const en = await loadEnglish();
const translations = readTranslations();

const merged = structuredClone(en);
const touched = new Set(); // "page.field" branches that carry a translation
const unknown = [];

for (const [key, value] of translations) {
  const segments = parseKeyPath(key);
  let node = merged;
  let ok = true;
  for (const segment of segments.slice(0, -1)) {
    if (node == null || !(segment in node)) { ok = false; break; }
    node = node[segment];
  }
  const leaf = segments.at(-1);
  if (!ok || node == null || !(leaf in node) || typeof node[leaf] !== "string") {
    unknown.push(key);
    continue;
  }
  node[leaf] = value;
  touched.add(`${segments[0]}.${segments[1]}`);
}

// Keep only the branches that actually carry a translation.
const ml = {};
for (const [page, fields] of Object.entries(merged)) {
  for (const [field, value] of Object.entries(fields)) {
    if (!touched.has(`${page}.${field}`)) continue;
    (ml[page] ??= {})[field] = value;
  }
}

const catalog = fs.readFileSync(CATALOG, "utf8");
const startMarker = "// ml:start\n";
const endMarker = "// ml:end";
const from = catalog.indexOf(startMarker);
const to = catalog.indexOf(endMarker);
if (from === -1 || to === -1) throw new Error("ml:start / ml:end markers missing");

const block = `const ml: QuotationTranslation = ${JSON.stringify(ml, null, 2)};\n`;
fs.writeFileSync(CATALOG, catalog.slice(0, from + startMarker.length) + block + catalog.slice(to));

const pages = Object.keys(ml).length;
const fields = Object.values(ml).reduce((n, page) => n + Object.keys(page).length, 0);
console.log(`ml updated: ${translations.size} translated strings -> ${fields} fields across ${pages} pages`);
if (unknown.length) {
  console.warn(`\n${unknown.length} checklist key(s) do not exist in the English catalog and were skipped:`);
  for (const key of unknown) console.warn("  -", key);
  process.exitCode = 1;
}
