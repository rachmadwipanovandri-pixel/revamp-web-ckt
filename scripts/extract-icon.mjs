#!/usr/bin/env node
// Dev-time helper — not part of the app build.
// Extracts a single icon's data from an installed @iconify-json/* collection
// and prints a pasteable `export const` for src/lib/icons.ts. Usage:
//
//   node scripts/extract-icon.mjs mdi:instagram
//
// Add the collection to COLLECTIONS below the first time you need an icon
// from a set that isn't listed yet (after `pnpm add -D @iconify-json/<set>`).

import { createRequire } from "node:module";
import { getIconData } from "@iconify/utils";

const require = createRequire(import.meta.url);

const COLLECTIONS = {
  lucide: "@iconify-json/lucide/icons.json",
  logos: "@iconify-json/logos/icons.json",
  mdi: "@iconify-json/mdi/icons.json",
  solar: "@iconify-json/solar/icons.json",
};

function pascalCase(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

const [arg] = process.argv.slice(2);
if (!arg || !arg.includes(":")) {
  console.error(
    "Usage: node scripts/extract-icon.mjs <prefix:name>  (e.g. mdi:instagram)",
  );
  process.exit(1);
}

const [prefix, name] = arg.split(":");
const modulePath = COLLECTIONS[prefix];
if (!modulePath) {
  console.error(
    `Unknown icon set prefix "${prefix}". Known: ${Object.keys(COLLECTIONS).join(", ")}`,
  );
  process.exit(1);
}

const collection = require(modulePath);
const icon = getIconData(collection, name);
if (!icon) {
  console.error(`Icon "${name}" not found in the "${prefix}" set.`);
  process.exit(1);
}

const constName = prefix + pascalCase(name);
const { body, width, height } = icon;
console.log(
  `export const ${constName}: IconifyIcon = ${JSON.stringify({ body, width, height }, null, 2)};`,
);
