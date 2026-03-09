// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'gym-manager-pull.b-cdn.net',
            },
            {
                protocol: 'https',
                hostname: 'golden-ray.b-cdn.net',
            },
            {
                protocol: 'https',
                hostname: 'blog.flarize.com',
            },
        ],
    },
    reactStrictMode: true,
};

export default nextConfig;