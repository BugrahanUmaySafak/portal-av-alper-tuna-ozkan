/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com", "picsum.photos"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**", // YouTube video thumbnail path
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**", // Eğer placeholder görselleri de kullanıyorsan
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // '2mb', '10mb' gibi arttırabilirsiniz
    },
  },
};

export default nextConfig;
