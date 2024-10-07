import withTM from "next-transpile-modules";

const nextConfig = withTM(["react-leaflet", "leaflet"])({
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // Leaflet sometimes needs these fallbacks
      path: false, // Avoid Webpack issues with node modules
    };
    return config;
  },
  reactStrictMode: true,
});

export default nextConfig;
