// Generates self-contained SVG placeholder images for every product image
// referenced in src/data/catalog.json, plus brand assets (logo, icon, OG).
//
// Run: node scripts/generate-placeholders.mjs
//
// These are intentionally simple, themeable gradients so the demo has no
// external image dependencies and works on any host, online or offline.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "src", "data", "catalog.json");
const outDir = path.join(root, "public", "products");
const publicDir = path.join(root, "public");

/** Category -> base hue (OKLCH-ish, expressed in HSL for the SVG gradient). */
const HUE = {
  skincare: 168,
  makeup: 342,
  bags: 28,
  stationery: 262,
  accessories: 205,
  home: 18,
};

function initials(name) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]),
  );
}

function productSvg({ hue, index, label, mono }) {
  const h = (hue + index * 14) % 360;
  const c1 = `hsl(${h} 62% 88%)`;
  const c2 = `hsl(${(h + 24) % 360} 55% 72%)`;
  const c3 = `hsl(${(h + 8) % 360} 45% 40%)`;
  const cx = index % 2 === 0 ? 560 : 250;
  const cy = index % 3 === 0 ? 260 : 540;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="r" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0" stop-color="white" stop-opacity="0.55"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <circle cx="${cx}" cy="${cy}" r="230" fill="url(#r)"/>
  <text x="400" y="430" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="230" font-weight="800" fill="${c3}" fill-opacity="0.28">${escapeXml(mono)}</text>
  <text x="400" y="620" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="600" fill="${c3}" fill-opacity="0.85">${escapeXml(label)}</text>
  <text x="400" y="672" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="500" letter-spacing="3" fill="${c3}" fill-opacity="0.55">SABAI SHOP</text>
</svg>`;
}

function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <rect width="40" height="40" rx="11" fill="#0f9d76"/>
  <path d="M14 26c0-3 3-4 6-4s6-1 6-4-3-4-6-4-5 1-6 3" fill="none" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
  <circle cx="20" cy="20" r="1.6" fill="white"/>
</svg>`;
}

function iconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#0f9d76"/>
  <path d="M22 42c0-5 5-6.5 10-6.5S42 34 42 29s-5-6.5-10-6.5-8.5 1.6-10 5" fill="none" stroke="white" stroke-width="5.2" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="2.6" fill="white"/>
</svg>`;
}

function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#d7f2e8"/>
      <stop offset="1" stop-color="#8fd9bf"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="80" y="80" width="90" height="90" rx="24" fill="#0f9d76"/>
  <path d="M104 132c0-9 9-12 20-12s20-3 20-12" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" transform="translate(-8 -6)"/>
  <text x="200" y="145" font-family="Segoe UI, Arial, sans-serif" font-size="56" font-weight="800" fill="#0b5c46">Sabai Shop</text>
  <text x="82" y="330" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="800" fill="#0b3b2e">Everyday beauty &amp; lifestyle</text>
  <text x="82" y="410" font-family="Segoe UI, Arial, sans-serif" font-size="42" font-weight="500" fill="#0b5c46">Ready to ship — order online, no account needed.</text>
</svg>`;
}

async function main() {
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

  let count = 0;
  for (const product of catalog.products) {
    const hue = HUE[product.categoryId] ?? 200;
    const category = catalog.categories.find((c) => c.id === product.categoryId);
    const label = category ? category.name : "Sabai Shop";
    const mono = initials(product.name) || "SB";
    for (let i = 0; i < product.images.length; i++) {
      const rel = product.images[i].replace(/^\//, "");
      const file = path.join(root, "public", rel.replace(/^products\//, "products/"));
      const dir = path.dirname(file);
      if (!existsSync(dir)) await mkdir(dir, { recursive: true });
      await writeFile(file, productSvg({ hue, index: i, label, mono }), "utf8");
      count++;
    }
  }

  await writeFile(path.join(publicDir, "logo.svg"), logoSvg(), "utf8");
  await writeFile(path.join(publicDir, "og.svg"), ogSvg(), "utf8");
  await writeFile(path.join(root, "src", "app", "icon.svg"), iconSvg(), "utf8");

  console.log(`Generated ${count} product images + logo.svg + og.svg + app/icon.svg`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
