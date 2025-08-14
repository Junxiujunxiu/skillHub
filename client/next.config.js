/**@type {import('next').NextConfig} */

//Without this config, Next.js would block external images and show an error.
// Allow Next.js Image component to load and optimize images from images.pexels.com
const NextConfig ={
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                port: "",
                pathname: '/**',
            },
        ],
    },
}

module.exports = NextConfig;