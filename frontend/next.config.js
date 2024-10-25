// tells your IDE that this object should match Next.js's configuration type
/** @type {import('next').NextConfig} */

const nextConfig = {
  // Tells Next.js to process (transpile) these npm packages through Babel
  /* Necessary because these packages might contain modern JS that needs to be converted
    for older browsers - without this, Next.js by default doesn't transpile node_modules */
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
