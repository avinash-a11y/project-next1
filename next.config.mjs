/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['1000logos.net' , 'images.unsplash.com' , 'img.freepik.com'],
    },
    // Ensure dynamic rendering for routes that use session or authentication
    experimental: {
        // This is the default in Next.js 14 but let's be explicit
        serverActions: true,
    },
};

export default nextConfig;
