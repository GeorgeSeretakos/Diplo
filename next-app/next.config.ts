import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.infrastructureLogging = { level: "error" }; // Suppress Webpack warnings
        return config;
    },
    reactStrictMode: false, // Optional
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "1338",
                pathname: "/uploads/**",
            },
        ],
    },
};

export default nextConfig;
