'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { ArrowRight, Star, Heart, Truck } from 'lucide-react'

// Mock data for development - will be replaced with Supabase data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Coastal Driftwood Sculpture',
    description: 'Hand-carved driftwood sculpture inspired by coastal beauty.',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
    category: 'Sculptures',
    status: 'active',
    featured: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Handwoven Sea Glass Bracelet',
    description: 'Delicate bracelet featuring authentic sea glass collected from coastal beaches.',
    price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop',
    category: 'Jewelry',
    status: 'active',
    featured: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Rustic Crab Shell Candle',
    description: 'Natural soy candle housed in a real crab shell with ocean breeze scent.',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1602874801006-e26c4c5b5e8a?w=500&h=500&fit=crop',
    category: 'Candles',
    status: 'active',
    featured: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    // In production, this would fetch from Supabase
    setFeaturedProducts(mockProducts.filter(p => p.featured))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Handcrafted with
              <span className="text-blue-600 block">Coastal Inspiration</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Welcome to Crabtree Bay Studio, where Lora and Ken create unique handcrafted goods 
              inspired by the beauty of coastal living. Each piece tells a story of artisan 
              craftsmanship and coastal charm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>Shop Collection</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="border border-slate-300 hover:border-slate-400 text-slate-700 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Handcrafted with Love</h3>
              <p className="text-slate-600">
                Every piece is carefully crafted by hand with attention to detail and passion for quality.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Unique Designs</h3>
              <p className="text-slate-600">
                Inspired by coastal beauty, each design is one-of-a-kind and tells its own story.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Fast Shipping</h3>
              <p className="text-slate-600">
                Quick and secure shipping to bring our coastal creations directly to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Collection</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover our most popular handcrafted pieces, each one carefully selected to showcase 
              the beauty and craftsmanship of coastal artistry.
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No featured products available at the moment.</p>
              <Link
                href="/shop"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse all products →
              </Link>
            </div>
          )}
          
          <div className="text-center">
            <Link
              href="/shop"
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Connected</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Be the first to know about new collections, special offers, and behind-the-scenes stories 
            from our studio.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}