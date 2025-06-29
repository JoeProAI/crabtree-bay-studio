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
  }
}

module.exports = nextConfig