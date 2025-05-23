/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'framerusercontent.com',
      'images.unsplash.com',
      'icon-library.com',
      'cdn.iconscout.com',
      'static.vecteezy.com',
      'ouch-cdn0.icons8.com', // Make sure this is here if you're using the Ouch! icons
    ],
  },
};

export default nextConfig;