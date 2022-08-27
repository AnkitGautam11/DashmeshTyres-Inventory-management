/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGO_URI:
      "mongodb+srv://admin:adminpassword@cluster0.m8dxdpf.mongodb.net/?retryWrites=true&w=majority",
    JWT_SECRET: "aksbdakshbdkjahsvdfsjdhfvks",
  },
};

module.exports = nextConfig;
