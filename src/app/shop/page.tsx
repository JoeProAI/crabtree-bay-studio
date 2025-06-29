'use client'

import React, { useEffect, useState } from 'react'
import { Product } from '@/types'
import { Search, Filter } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(['All'])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔍 Fetching products for shop page...')
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          console.error('❌ API response not OK:', response.status, response.statusText)
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
        
        const responseData = await response.json()
        console.log('🔄 API response format:', responseData)
        
        // Handle both old and new API response formats
        let productData: Product[] = [];
        
        if (Array.isArray(responseData)) {
          // Old format - direct array of products
          productData = responseData;
          console.log('📦 Using legacy API response format (direct array)')
        } else if (responseData.products && Array.isArray(responseData.products)) {
          // New format - {success, count, products}
          productData = responseData.products;
          console.log(`📦 Using new API response format (${responseData.count} products)`)
        } else if (responseData.error) {
          // Error response
          console.error('❌ API returned error:', responseData.error)
          throw new Error(`API error: ${responseData.error}`)
        } else {
          console.error('❓ Unknown API response format:', responseData)
          throw new Error('Invalid API response format')
        }
        
        console.log('✅ Products loaded successfully:', productData.length)
        setProducts(productData)
        
        // Extract unique categories
        const productCategories = productData
          .map(p => p.category)
          .filter((category): category is string => typeof category === 'string' && category.length > 0)
        const uniqueCategories: string[] = ['All', ...Array.from(new Set(productCategories))]
        setCategories(uniqueCategories)
      } catch (e) {
        console.error('Error fetching products:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="bg-wood-light py-12 wood-texture">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-sawdust font-heading">Shop Our Products</h1>
            <p className="mt-2 text-lg text-sawdust">
              Discover our handcrafted artisan woodworking goods
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Category:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-slate-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
