import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getToolBySlug, getSimilarTools } from '@/lib/db'
import { ToolCard } from '@/components/tool-card'

interface ToolPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug)
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.'
    }
  }

  return {
    title: tool.metaTitle || `${tool.title} - Free Online Tool`,
    description: tool.metaDescription || tool.description,
    keywords: tool.metaTags || `${tool.title}, online tool, free tool, ${tool.category.name}`,
    openGraph: {
      title: tool.metaTitle || tool.title,
      description: tool.metaDescription || tool.description,
      type: 'website',
    },
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const tool = await getToolBySlug(params.slug)
  
  if (!tool) {
    notFound()
  }

  const similarTools = await getSimilarTools(tool.id, 6)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Tool Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {tool.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {tool.description}
              </p>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {tool.category.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Free Online Tool
                </span>
              </div>
            </div>
          </div>

          {/* Tool Interface */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {tool.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Interactive tool interface will be implemented here
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tool functionality: {tool.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Tools */}
        {similarTools.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Similar Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarTools.map((similarTool) => (
                <ToolCard key={similarTool.id} tool={similarTool} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}