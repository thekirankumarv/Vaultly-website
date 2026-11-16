import type { NextConfig } from 'next';

const base = process.env.VERCEL ? '' : '/Vaultly-website';

export default {
  output: 'export',
  basePath: base,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE: base },
} satisfies NextConfig;
