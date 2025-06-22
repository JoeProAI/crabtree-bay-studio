'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react'
import { Product } from '@/types'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    status: 'active' as const,
    featured: false
  })

  // Simple password authentication (in production, use proper auth)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'crabtree2025') {
      setIsAuthenticated(true)
      localStorage.setItem('admin-auth', 'true')
      fetchProducts() // Load products after login
    } else {
      alert('Incorrect password')
    }
  }

  // Check if already logged in
  useEffect(() => {
    if (localStorage.getItem('admin-auth') === 'true') {
      setIsAuthenticated(true)
      fetchProducts() // Load products if already authenticated
    }
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin-auth')
    setProducts([]) // Clear products on logout
  }

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        console.error('Failed to fetch products')
        alert('Failed to load products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        image_url: newProduct.image_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
        category: newProduct.category,
        status: newProduct.status,
        featured: newProduct.featured,
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const newProductData = await response.json()
        setProducts([newProductData, ...products])
        setNewProduct({
          name: '',
          description: '',
          price: '',
          image_url: '',
          category: '',
          status: 'active',
          featured: false
        })
        setShowAddForm(false)
        alert('Product added successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to add product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Error adding product')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProduct = async (updatedProduct: Product) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedData : p))
        setEditingProduct(null)
        alert('Product updated successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to update product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
        alert('Product deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to delete product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    } finally {
      setLoading(false)
    }
  }

  const toggleProductStatus = async (id: string) => {
    const product = products.find(p => p.id === id)
    if (!product) return

    const updatedProduct: Product = {
      ...product,
      status: product.status === 'active' ? 'inactive' : 'active'
    }

    await handleUpdateProduct(updatedProduct)
  }

  const toggleFeatured = async (id: string) => {
    const product = products.find(p => p.id === id)
    if (!product) return

    const updatedProduct = {
      ...product,
      featured: !product.featured
    }

    await handleUpdateProduct(updatedProduct)
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-500">
            Demo password: crabtree2025
          </div>
        </div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Product Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Product</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Add New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Jewelry, Candles, Sculptures"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your product..."
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                    className="mr-2"
                  />
                  Featured Product
                </label>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Product</span>
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={product.image_url}
                          alt={product.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-slate-500 max-w-xs truncate">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleProductStatus(product.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.status === 'active' ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                        {product.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.featured
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {product.featured ? '⭐ Featured' : 'Not Featured'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Edit Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editingProduct.image_url}
                    onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => handleUpdateProduct(editingProduct)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}