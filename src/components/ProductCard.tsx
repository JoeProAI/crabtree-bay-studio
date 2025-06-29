'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    console.log('🛒 Add to cart button clicked for product:', product.name)
    console.log('🔍 Product details:', product)
    
    try {
      e.preventDefault()
      e.stopPropagation()
      
      console.log('✅ Event prevented and stopped. Calling addItem...')
      addItem(product)
      console.log('👍 addItem called successfully!')
      
      // Check if the cart was updated properly
      setTimeout(() => {
        const cart = JSON.parse(localStorage.getItem('crabtree-cart') || '{}')
        console.log('📊 Cart after adding item:', cart)
      }, 100)
    } catch (error) {
      console.error('❌ Error adding item to cart:', error)
    }
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="aspect-square relative overflow-hidden bg-slate-100" style={{ position: 'relative' }}>
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {product.featured && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-medium text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-wood-dark hover:bg-mahogany text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
            aria-label="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="ml-1">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  )
}