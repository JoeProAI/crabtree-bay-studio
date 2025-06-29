/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'pixiomedia.nyc3.digitaloceanspaces.com',
      'yumlambiqahnkfqiqamu.supabase.co',
      'crabtreebaystudio.com'
    ],
    unoptimized: true,  // This bypasses the image optimization API for external images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src 'self' data: https://q.stripe.com https://js.stripe.com https: blob:; font-src 'self' data: https://js.stripe.com; connect-src 'self' https://api.stripe.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com; frame-src https://*.stripe.com;"
          }
        ],
      },
    ];
  }
}

module.exports = nextConfig