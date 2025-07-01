// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true, // Disables Image Optimization API
		domains:['gym-manager-pull.b-cdn.net'],
	},
	// Keep your existing config
	reactStrictMode: true,
};

export default nextConfig;
