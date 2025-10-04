// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'gym-manager-pull.b-cdn.net',
            },
        ],
    },
    reactStrictMode: true,
};

export default nextConfig;