import { Suspense } from 'react'
import { getCategories, getTools, getPopularTools, initializeDatabase } from '@/lib/db'
import { ToolCard } from '@/components/tool-card'
import { CategoryCard } from '@/components/category-card'
import { PopularTools } from '@/components/popular-tools'
import { SearchBox } from '@/components/search-box'
import { Skeleton } from '@/components/ui/skeleton'

export default async function HomePage() {
  // Initialize database on first load
  await initializeDatabase()
  
  const [categories, tools, popularTools] = await Promise.all([
    getCategories(),
    getTools(),
    getPopularTools(10)
  ])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="seo-h1">
                Free Online SEO Tools & Utilities
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Discover our comprehensive collection of 300+ free online tools for SEO analysis, 
                text manipulation, PDF conversion, image editing, and much more. All tools are 
                completely free and require no registration.
              </p>
              <SearchBox />
            </div>

            {/* Tool Categories */}
            <section className="mb-12">
              <h2 className="seo-h2 mb-8">Tool Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </section>

            {/* Featured Tools Grid */}
            <section className="mb-12">
              <h2 className="seo-h2 mb-8">Featured Tools</h2>
              <div className="hidden md:block">
                <div className="tools-grid">
                  {tools.slice(0, 20).map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
              
              {/* Mobile Layout */}
              <div className="md:hidden tools-grid-mobile">
                {tools.slice(0, 20).map((tool) => (
                  <div key={tool.id} className="tool-card">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {tool.title}
                    </h3>
                  </div>
                ))}
              </div>
            </section>

            {/* SEO Content */}
            <section className="prose dark:prose-invert max-w-none">
              <h2 className="seo-h2">Why Choose Our SEO Tools?</h2>
              <p>
                Our comprehensive suite of SEO tools helps webmasters, digital marketers, 
                and content creators optimize their websites for better search engine rankings. 
                All tools are free, fast, and provide accurate results.
              </p>
              
              <h3 className="seo-h3">Key Features:</h3>
              <ul>
                <li>300+ free online tools across 10 categories</li>
                <li>No registration required - use instantly</li>
                <li>Mobile-friendly responsive design</li>
                <li>Fast processing and accurate results</li>
                <li>Regular updates with new tools</li>
                <li>Privacy-focused - your data stays secure</li>
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <PopularTools tools={popularTools} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}