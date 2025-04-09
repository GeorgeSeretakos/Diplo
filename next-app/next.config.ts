import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.infrastructureLogging = { level: "error" }; // Suppress Webpack warnings
        return config;
    },
    reactStrictMode: false, // (Optional) Disable React Strict Mode if needed
};

export default nextConfig;
