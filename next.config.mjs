/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Disable Image Optimization API
  },
  experimental: {
    // Disable parallel features to reduce memory usage
    webpackBuildWorker: false,
    parallelServerBuildTraces: false,
    parallelServerCompiles: false,
    // Enable only if needed
    workerThreads: false,
    cpus: 1
  }
};

// Safe config file loading
let userConfig = {};
try {
  const configModule = await import("./INSA-PersonalityTest-saas-web-app.config.mjs");
  userConfig = configModule.default || configModule;
} catch (e) {
  try {
    const configModule = await import("./INSA-PersonalityTest-saas-web-app.config");
    userConfig = configModule.default || configModule;
  } catch (innerError) {
    console.log('No custom config file found');
  }
}

// Merge configurations safely
const mergedConfig = {
  ...nextConfig,
  ...userConfig,
  // Ensure critical configs aren't overwritten
  output: nextConfig.output,
  experimental: {
    ...nextConfig.experimental,
    ...(userConfig.experimental || {})
  }
};

export default mergedConfig;