import React from 'react'
import Image from 'next/image'
import { Heart, Waves, Palette } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Our Story</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Welcome to Crabtree Bay Studio, where passion meets craftsmanship and every piece 
            tells a story of coastal inspiration and artistic dedication.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-16">
          <Image
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=400&fit=crop"
            alt="Coastal workshop scene"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-2">Handcrafted with Love</h2>
              <p className="text-lg">Creating beautiful pieces inspired by coastal living</p>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Meet Lora & Ken</h2>
              <p className="text-slate-600 mb-4">
                Lora and Ken are the heart and soul behind Crabtree Bay Studio. Their journey began 
                with a shared love for coastal living and a passion for creating beautiful, functional 
                art that brings the serenity of the shore into everyday life.
              </p>
              <p className="text-slate-600 mb-4">
                What started as a weekend hobby has blossomed into a full-time passion. Each piece 
                they create is infused with their love for the ocean, attention to detail, and 
                commitment to quality craftsmanship.
              </p>
              <p className="text-slate-600">
                From hand-carved driftwood sculptures to delicate sea glass jewelry, every item 
                in their collection reflects their dedication to preserving the natural beauty 
                of coastal treasures.
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop"
                alt="Artisans at work"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Passion & Love</h3>
              <p className="text-slate-600">
                Every piece is created with genuine passion and love for the craft, ensuring 
                that each item carries positive energy and care.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Coastal Inspiration</h3>
              <p className="text-slate-600">
                Drawing inspiration from the natural beauty of coastal environments, we create 
                pieces that bring the tranquility of the shore to your home.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Artisan Quality</h3>
              <p className="text-slate-600">
                We believe in the beauty of handmade items and the unique character that comes 
                from traditional craftsmanship techniques.
              </p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Inspiration</h4>
              <p className="text-sm text-slate-600">
                We find inspiration in coastal walks, collecting natural materials and observing 
                the beauty of shore life.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Design</h4>
              <p className="text-sm text-slate-600">
                Each piece is carefully designed to highlight the natural beauty of our materials 
                while ensuring functionality.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Craft</h4>
              <p className="text-sm text-slate-600">
                Using traditional techniques and modern tools, we carefully craft each piece 
                with attention to every detail.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Share</h4>
              <p className="text-sm text-slate-600">
                We lovingly package and share our creations, hoping they bring joy and coastal 
                serenity to your space.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Explore?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Discover our collection of handcrafted coastal treasures and bring a piece of 
            the shore into your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Collection
            </a>
            <a
              href="/contact"
              className="border border-slate-300 hover:border-slate-400 text-slate-700 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}