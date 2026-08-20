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
            // Host canonicalisation: www.flarize.com -> flarize.com, path and
            // query preserved, single permanent hop. The hosting edge already
            // performs this redirect, so in production this rule is a dormant
            // safety net -- it only fires if a www request ever reaches the
            // app (edge rule removed/misconfigured). It cannot create a chain:
            // the destination host never matches the `has` condition.
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.flarize.com' }],
                destination: 'https://flarize.com/:path*',
                permanent: true,
            },
            // /aboutus is in the GSC report but its route was removed, so the
            // www 301 currently lands on a 404. Point it at the live About page
            // (a real equivalent, not the homepage) so the hop terminates on 200.
            {
                source: '/aboutus',
                destination: '/about',
                permanent: true,
            },
            // Legacy id-based resource/project URLs -> descriptive slugs.
            // Every destination is a slug that exists in the mock data; ids
            // 2, 3 and 6 were byte-identical duplicates of id 1 (same title,
            // description and category), so all three collapse onto the single
            // canonical article rather than getting invented URLs of their own.
            { source: '/resources/1', destination: '/resources/rooftop-solar-battery-storage', permanent: true },
            { source: '/resources/2', destination: '/resources/rooftop-solar-battery-storage', permanent: true },
            { source: '/resources/3', destination: '/resources/rooftop-solar-battery-storage', permanent: true },
            { source: '/resources/6', destination: '/resources/rooftop-solar-battery-storage', permanent: true },
            { source: '/resources/4', destination: '/resources/solar-panel-maintenance-tips', permanent: true },
            { source: '/resources/5', destination: '/resources/solar-impact-urban-planning', permanent: true },
            { source: '/resources/h1', destination: '/resources/solar-energy-industries', permanent: true },
            { source: '/resources/h2', destination: '/resources/rooftop-solar-iot-benefits', permanent: true },
            { source: '/resources/h3', destination: '/resources/group-net-metering-rooftop-solar', permanent: true },
            { source: '/resources/h4', destination: '/resources/future-of-solar-innovations', permanent: true },
            { source: '/resources/h5', destination: '/resources/solar-energy-rural-communities', permanent: true },
            { source: '/projects/1', destination: '/projects/jose-vp-vadackkal-alappuzha', permanent: true },
            { source: '/projects/2', destination: '/projects/siraj-kp-cherthala-alappuzha', permanent: true },
            { source: '/projects/3', destination: '/projects/stephen-vc-vattayal-alappuzha', permanent: true },
            { source: '/projects/4', destination: '/projects/usha-viswanathan-thiruvambady-alappuzha', permanent: true },
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