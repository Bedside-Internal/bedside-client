import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
        bodySizeLimit: "20mb", // match the multer limit on the Express side
    },
},
};

export default nextConfig;
