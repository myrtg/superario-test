import withTM from "next-transpile-modules";

const nextConfig = withTM(["react-leaflet", "leaflet"])({
  reactStrictMode: true, // You can keep other Next.js configurations here
});

export default nextConfig;
