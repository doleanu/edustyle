/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
    ],
  },
  // Next.js Multi Zones: /bold and /bold2 are separate Next.js apps
  // (each with basePath set to match) deployed as their own Vercel
  // projects, transparently proxied in here so every design lives
  // under one domain. See ~/code/edustyle-bold and ~/code/edustyle-bold2.
  async rewrites() {
    return [
      {
        source: "/bold",
        destination: "https://edustyle-bold.vercel.app/bold",
      },
      {
        source: "/bold/:path*",
        destination: "https://edustyle-bold.vercel.app/bold/:path*",
      },
      {
        source: "/bold2",
        destination: "https://edustyle-bold2.vercel.app/bold2",
      },
      {
        source: "/bold2/:path*",
        destination: "https://edustyle-bold2.vercel.app/bold2/:path*",
      },
    ];
  },
};

export default nextConfig;
