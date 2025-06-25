'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { ArrowRight, Truck, Hammer, CircleDot } from 'lucide-react'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true')
        if (response.ok) {
          const products = await response.json()
          setFeaturedProducts(products)
        } else {
          console.error('Failed to fetch featured products')
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-wood-light wood-texture py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-sawdust mb-6 font-heading">
              Handcrafted with
              <span className="text-mahogany block">Artisan Precision</span>
            </h1>
            <p className="text-xl text-cedar mb-8 max-w-3xl mx-auto">
              Welcome to Crabtree Bay Studio, where Lora and Ken create unique handcrafted wooden goods 
              with traditional craftsmanship. Each piece tells a story of artisan 
              woodworking and rustic charm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-mahogany hover:bg-wood-dark text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>Shop Collection</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="border border-wood-medium hover:border-wood-dark text-cedar px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-sawdust">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-wood-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-mahogany">
                <Hammer className="h-8 w-8 text-mahogany" />
              </div>
              <h3 className="text-lg font-semibold text-wood-dark mb-2 font-heading">Handcrafted Excellence</h3>
              <p className="text-cedar">
                Every piece is carefully crafted by hand with attention to detail and passion for woodworking quality.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-wood-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-mahogany">
                <CircleDot className="h-8 w-8 text-mahogany" />
              </div>
              <h3 className="text-lg font-semibold text-wood-dark mb-2 font-heading">Unique Designs</h3>
              <p className="text-cedar">
                Inspired by traditional woodworking, each design is one-of-a-kind and tells its own story.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-wood-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-mahogany">
                <Truck className="h-8 w-8 text-mahogany" />
              </div>
              <h3 className="text-lg font-semibold text-wood-dark mb-2 font-heading">Fast Shipping</h3>
              <p className="text-cedar">
                Quick and secure shipping to bring our handcrafted wooden creations directly to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-workshop-concrete">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-wood-dark mb-4 font-heading">Featured Collection</h2>
            <p className="text-lg text-cedar max-w-2xl mx-auto">
              Discover our most popular handcrafted wooden pieces, each one carefully selected to showcase 
              the beauty and craftsmanship of traditional woodworking.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-cedar mb-4">Loading featured products...</p>
            </div>
          ) : (
            featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-cedar mb-4">No featured products available at the moment.</p>
                <Link
                  href="/shop"
                  className="text-mahogany hover:text-wood-dark font-medium"
                >
                  Browse all products →
                </Link>
              </div>
            )
          )}
          
          <div className="text-center">
            <Link
              href="/shop"
              className="bg-wood-dark hover:bg-walnut text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-mahogany wood-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-sawdust mb-4 font-heading">Stay Connected</h2>
          <p className="text-wood-light mb-8 max-w-2xl mx-auto">
            Be the first to know about new collections, special offers, and behind-the-scenes stories 
            from our woodworking studio.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-wood-medium focus:outline-none"
            />
            <button className="bg-wood-dark hover:bg-walnut text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}