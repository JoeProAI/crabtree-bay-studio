'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart, Menu, X, User, Hammer, Axe, CircleDot } from 'lucide-react'

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
    <div className="flex flex-col min-h-screen bg-workshop-concrete">
      {/* Header */}
      <header className="bg-wood-dark border-b border-wood-medium shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center bg-mahogany rounded-full p-2">
                <Hammer className="h-8 w-8 text-sawdust" />
              </div>
              <div className="text-2xl font-bold text-sawdust font-heading">
                Crabtree Bay Studio
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-wood-light hover:text-sawdust px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-wood-light hover:text-sawdust">
                <ShoppingCart className="h-6 w-6" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-mahogany text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </Link>

              {/* Admin Login */}
              <Link href="/admin" className="p-2 text-wood-light hover:text-sawdust">
                <User className="h-6 w-6" />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-wood-light hover:text-sawdust"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-wood-medium py-4">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-wood-light hover:text-sawdust px-3 py-2 text-sm font-medium"
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
      <footer className="bg-walnut text-wood-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 font-heading">Crabtree Bay Studio</h3>
              <p className="text-wood-light mb-4">
                Handcrafted goods made with love. Each piece tells a story 
                of woodworking tradition and artisan craftsmanship.
              </p>
              <p className="text-wood-light">
                Created by Lora and Ken with passion for quality and creativity.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 font-heading">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-wood-light hover:text-sawdust transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 font-heading">
                Contact
              </h4>
              <div className="space-y-2 text-wood-light">
                <p>USA</p>
                <p>info@crabtreestudio.com</p>
                <div className="pt-4">
                  <Link
                    href="/admin"
                    className="text-sm text-cedar hover:text-sawdust"
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-wood-medium mt-8 pt-8 text-center text-cedar">
            <div className="flex justify-center space-x-4 mb-4">
              <CircleDot className="h-5 w-5" />
              <Hammer className="h-5 w-5" />
              <Axe className="h-5 w-5" />
            </div>
            <p>&copy; 2025 Crabtree Bay Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}