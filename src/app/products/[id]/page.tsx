'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  const productId = params.id as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          console.log('🔄 Product API response format:', data)
          
          // Handle both response formats - new API returns {success, count, products}
          const products = Array.isArray(data) ? data : (data.products || [])
          
          const foundProduct = products.find((p: Product) => p.id === productId)
          
          if (foundProduct) {
            console.log('✅ Found product:', foundProduct.name)
            setProduct(foundProduct)
          } else {
            console.log('⚠️ Product not found with ID:', productId)
            // Product not found, redirect to shop
            router.push('/shop')
          }
        } else {
          console.error('Failed to fetch products')
          router.push('/shop')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        router.push('/shop')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, router])

  const handleAddToCart = async () => {
    if (!product) return
    
    setAddingToCart(true)
    try {
      addItem(product, quantity)
      // Show success feedback
      alert('Added to cart successfully!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return
    
    // Add to cart and redirect to cart
    addItem(product, quantity)
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-slate-600">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">Product not found.</p>
            <Link href="/shop" className="text-blue-600 hover:text-blue-700 font-medium">
              Return to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Shop */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>

            {/* Rating (placeholder) */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-slate-600 text-sm">(24 reviews)</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Quantity
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-slate-300 rounded-md px-3 py-2 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Buy Now
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full border border-slate-300 hover:border-slate-400 text-slate-700 py-3 px-6 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
              </button>
            </div>

            {/* Features */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-slate-600">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-slate-600">30-day money-back guarantee</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-green-600" />
                  <span className="text-slate-600">Easy returns & exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
