import type { NextConfig } from "next";

/**
 * The site is designed to deploy to any free host.
 *
 * - Default build (Vercel / Netlify / Cloudflare): a normal Next.js app.
 * - Static export (GitHub Pages): set `NEXT_EXPORT=true`. Optionally set
 *   `NEXT_PUBLIC_BASE_PATH` (e.g. "/my-repo") when hosting under a sub-path.
 *
 * Images are left unoptimized so that (a) static export works and (b) images
 * added at runtime from the admin panel (arbitrary URLs) load everywhere.
 * On Vercel you may flip `unoptimized` to false and add `remotePatterns`.
 */
const isExport = process.env.NEXT_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: isExport ? "export" : undefined,
  basePath: basePath || undefined,
  trailingSlash: isExport,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
