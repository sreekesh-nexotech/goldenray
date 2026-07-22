// next.config.ts
import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    outputFileTracingRoot: path.join(__dirname),
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
            // Local Blog CMS (dev) — uploaded media served from Django on :8009
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8009',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8009',
            },
        ],
    },
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/solar-faq',
                destination: '/faq',
                permanent: true,
            },
            {
                source: '/solar-solutions-kerala',
                destination: '/solutions',
                permanent: true,
            },
            {
                source: '/contact-flarize-solar',
                destination: '/contactus',
                permanent: true,
            },
            {
                source: '/solar-projects-kerala',
                destination: '/projects',
                permanent: true,
            },
            {
                source: '/solar-calculator',
                destination: '/advanced-calculator',
                permanent: true,
            },
            {
                source: '/solar-blog',
                destination: '/resources',
                permanent: true,
            },
            {
                source: '/blog/how-to-calculate-solar-roi-kerala',
                destination: '/blog/how-to-calculate-solar-roi-in-kerala',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;