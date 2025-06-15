import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategories, getToolsByCategory } from '@/lib/db'
import { ToolCard } from '@/components/tool-card'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = await getCategories()
  const category = categories.find(c => c.slug === params.slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    }
  }

  return {
    title: `${category.name} - Free Online Tools`,
    description: category.description || `Free online ${category.name.toLowerCase()} for webmasters and digital marketers.`,
    keywords: `${category.name}, online tools, free tools, ${category.name.toLowerCase()}`,
    openGraph: {
      title: `${category.name} - Free Online Tools`,
      description: category.description || `Free online ${category.name.toLowerCase()}.`,
      type: 'website',
    },
    alternates: {
      canonical: `/category/${category.slug}`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categories = await getCategories()
  const category = categories.find(c => c.slug === params.slug)
  
  if (!category) {
    notFound()
  }

  const tools = await getToolsByCategory(category.id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {category.description || `Comprehensive collection of free ${category.name.toLowerCase()} for webmasters and digital marketers.`}
          </p>
          <div className="mt-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white" style={{ backgroundColor: category.color }}>
              {tools.length} Tools Available
            </span>
          </div>
        </div>

        {/* Tools Grid */}
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Tools Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tools for this category are coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}