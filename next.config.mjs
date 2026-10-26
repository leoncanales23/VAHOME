/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // static export → Firebase Hosting (carpeta out/)
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
