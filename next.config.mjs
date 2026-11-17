/** @type {import('next').NextConfig} */
const nextConfig = {
  // The old multi-page routes now live as panels on the home page.
  async redirects() {
    return [
      { source: "/skills", destination: "/", permanent: true },
      { source: "/projects", destination: "/", permanent: true },
      { source: "/contact", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
