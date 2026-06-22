import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: true,
    logging: false,
    turbopack: {},
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
            },
            {
                protocol: 'https',
                hostname: 'static.tvmaze.com',
            },
            {
                protocol: 'https',
                hostname: 'media.rawg.io',
            },
        ],
    },
};

export default nextConfig;
