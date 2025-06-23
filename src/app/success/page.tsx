'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

// Separate component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()
  const [orderProcessed, setOrderProcessed] = useState(false)

  useEffect(() => {
    // Clear the cart after successful payment
    if (sessionId && !orderProcessed) {
      clearCart()
      setOrderProcessed(true)
    }
  }, [sessionId, clearCart, orderProcessed])

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Invalid Session</h1>
          <p className="text-slate-600 mb-6">This page is only accessible after a successful checkout.</p>
          <Link
            href="/shop"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-lg text-slate-600 mb-8">
            Thank you for your purchase! Your order has been confirmed and will be processed shortly.
          </p>

          {/* Order Details */}
          <div className="bg-slate-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-slate-900">Order Confirmation</span>
            </div>
            <p className="text-sm text-slate-600">
              Session ID: <span className="font-mono">{sessionId}</span>
            </p>
            <p className="text-sm text-slate-600 mt-2">
              You will receive an email confirmation shortly with tracking information.
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">What&apos;s Next?</h3>
            <div className="text-left space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <p className="text-slate-600">
                  We&apos;ll send you an email confirmation with your order details.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-blue-600">2</span>
                </div>
                <p className="text-slate-600">
                  Your handcrafted items will be carefully prepared and packaged.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-blue-600">3</span>
                </div>
                <p className="text-slate-600">
                  We&apos;ll notify you when your order ships with tracking information.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/shop"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
