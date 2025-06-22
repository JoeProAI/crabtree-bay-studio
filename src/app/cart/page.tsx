'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart.items }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        alert(`Checkout failed: ${error}`)
        return
      }

      // Redirect to Stripe Checkout
      const { loadStripe } = await import('@stripe/stripe-js')
      const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      
      if (stripeInstance) {
        await stripeInstance.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong during checkout. Please try again.')
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-slate-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-slate-600 mb-8">
              Looks like you haven&apos;t added any coastal treasures to your cart yet.
            </p>
            <Link
              href="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Shopping Cart</h1>
          <p className="text-slate-600">
            {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cart.items.map((item) => (
                <div key={item.id} className="p-6 border-b border-slate-200 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-slate-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {item.product.category}
                      </p>
                      <p className="text-lg font-semibold text-slate-900 mt-2">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                      >
                        <Minus className="h-4 w-4 text-slate-600" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="mt-4 text-right">
                    <span className="text-sm text-slate-600">Subtotal: </span>
                    <span className="font-semibold text-slate-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-medium">${(cart.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-slate-900">Total</span>
                    <span className="text-lg font-semibold text-slate-900">
                      ${(cart.total * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/shop"
                className="w-full border border-slate-300 hover:border-slate-400 text-slate-700 py-3 px-4 rounded-lg font-medium transition-colors text-center block"
              >
                Continue Shopping
              </Link>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="text-xs text-slate-500 mb-2">Secure Checkout</div>
                <div className="flex justify-center space-x-2">
                  <div className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">SSL</div>
                  <div className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">256-bit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}