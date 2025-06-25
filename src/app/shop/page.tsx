'use client'

import React, { useEffect, useState } from 'react'
import { Product } from '@/types'
import { Search, Filter } from 'lucide-react'
import Image from 'next/image'

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
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
          
          // Extract unique categories
          const products = data as Product[]
          const productCategories = products
            .map(p => p.category)
            .filter((category): category is string => typeof category === 'string' && category.length > 0)
          const uniqueCategories: string[] = ['All', ...Array.from(new Set(productCategories))]
          setCategories(uniqueCategories)
        } else {
          console.error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col border border-wood-light hover:border-wood-medium transition-colors">
                  <div className="relative h-48 bg-workshop-concrete">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover h-full w-full"
                        width={300}
                        height={200}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-wood-light">
                        <span className="text-wood-medium">No image</span>
                      </div>
                    )}
                    {product.featured && (
                      <span className="absolute top-2 right-2 bg-mahogany text-white text-xs px-2 py-1 rounded-md badge-handcrafted">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="text-lg font-medium text-wood-dark font-heading">{product.name}</h3>
                    <p className="mt-1 text-sm text-cedar line-clamp-2">{product.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-semibold text-wood-dark">${product.price.toFixed(2)}</span>
                      <button
                        onClick={() => console.log('Add to Cart')}
                        className="bg-wood-dark text-white px-3 py-1 rounded-md text-sm hover:bg-walnut transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
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