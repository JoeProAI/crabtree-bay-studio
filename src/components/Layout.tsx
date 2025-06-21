'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart, Menu, X, User } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1750473250202-image_ec24e265-6052-405c-9da8-62c8f33c8f4e_20250621_023409_245516.png?t=20250621_023409_245516"
                alt="Crabtree Bay Studio Logo"
                className="h-10 w-10 object-contain"
              />
              <div className="text-2xl font-bold text-slate-800">
                Crabtree Bay Studio
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-slate-600 hover:text-slate-900">
                <ShoppingCart className="h-6 w-6" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </Link>

              {/* Admin Login */}
              <Link href="/admin" className="p-2 text-slate-600 hover:text-slate-900">
                <User className="h-6 w-6" />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-4">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Crabtree Bay Studio</h3>
              <p className="text-slate-300 mb-4">
                Handcrafted goods made with love. Each piece tells a story 
                of coastal inspiration and artisan craftsmanship.
              </p>
              <p className="text-slate-300">
                Created by Lora and Ken with passion for quality and creativity.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Contact
              </h4>
              <div className="space-y-2 text-slate-300">
                <p>USA</p>
                <p>info@crabtreestudio.com</p>
                <div className="pt-4">
                  <Link
                    href="/admin"
                    className="text-sm text-slate-400 hover:text-slate-300"
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Crabtree Bay Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}