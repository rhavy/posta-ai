
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google
      { protocol: "https", hostname: "avatars.githubusercontent.com" }, // GitHub
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" }, // Facebook
    ],
  },
};

export default nextConfig;
