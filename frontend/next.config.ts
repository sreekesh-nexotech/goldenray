// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true, // Disables Image Optimization API
	},
	// Keep your existing config
	reactStrictMode: true,
};

export default nextConfig;
