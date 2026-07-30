/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
    ],
  },
  // Next.js Multi Zones: /bold is a separate Next.js app (basePath set to
  // match) deployed as its own Vercel project, transparently proxied in
  // here so it lives under this domain. See ~/code/edustyle-bold2 (the
  // "ink & vermilion" design — this now owns /bold).
  //
  // The old neon-noir design (~/code/edustyle-bold, previously also at
  // /bold) is unrouted, not deleted: its Vercel project is still live at
  // edustyle-bold.vercel.app/bold directly, just no longer linked from here.
  async rewrites() {
    return [
      {
        source: "/bold",
        destination: "https://edustyle-bold2.vercel.app/bold",
      },
      {
        source: "/bold/:path*",
        destination: "https://edustyle-bold2.vercel.app/bold/:path*",
      },
    ];
  },
};

export default nextConfig;
