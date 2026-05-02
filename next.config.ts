/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/wp-json/:path*',
        destination: 'http://co-coffee.test/wp-json/:path*',
      },
    ]
  },
}

module.exports = nextConfig