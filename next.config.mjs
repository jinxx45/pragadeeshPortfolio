/** @type {import('next').NextConfig} */
const nextConfig = {
  // The old multi-page routes now live as sections on the home page.
  async redirects() {
    return [
      { source: "/skills", destination: "/#skills", permanent: true },
      { source: "/projects", destination: "/#projects", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
