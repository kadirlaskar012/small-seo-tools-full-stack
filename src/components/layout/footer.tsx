import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-4">
              SEO Tools Pro
            </div>
            <p className="text-gray-300 text-sm">
              Free online SEO tools for webmasters and digital marketers. 
              Optimize your website with our comprehensive suite of tools.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/seo-tools" className="text-gray-300 hover:text-blue-400">SEO Tools</Link></li>
              <li><Link href="/category/text-tools" className="text-gray-300 hover:text-blue-400">Text Tools</Link></li>
              <li><Link href="/category/pdf-tools" className="text-gray-300 hover:text-blue-400">PDF Tools</Link></li>
              <li><Link href="/category/image-tools" className="text-gray-300 hover:text-blue-400">Image Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-300 hover:text-blue-400">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-blue-400">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-blue-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-blue-400">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="text-gray-300 hover:text-blue-400">Blog</Link></li>
              <li><Link href="/tutorials" className="text-gray-300 hover:text-blue-400">Tutorials</Link></li>
              <li><Link href="/api" className="text-gray-300 hover:text-blue-400">API</Link></li>
              <li><Link href="/help" className="text-gray-300 hover:text-blue-400">Help Center</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 SEO Tools Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}