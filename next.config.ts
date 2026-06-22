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
        ],
    },
};

export default nextConfig;
