import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: 'export',
  eslint: {
    // PERINGATAN: Ini akan mengizinkan proses build untuk berhasil 
    // meskipun ada error ESLint.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
