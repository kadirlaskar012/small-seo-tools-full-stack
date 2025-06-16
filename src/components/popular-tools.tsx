import React from 'react'
import Link from 'next/link'

interface Tool {
  id: number
  title: string
  slug: string
  description: string
  category: {
    name: string
    color: string
  }
  usageCount?: number
}

interface PopularToolsProps {
  tools: Tool[]
}

export function PopularTools({ tools }: PopularToolsProps) {
  return (
    <div className="sidebar-card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Popular Tools
      </h3>
      <div className="space-y-3">
        {tools.map((tool) => (
          <Link 
            key={tool.id} 
            href={`/${tool.slug}`}
            className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {tool.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {tool.category.name}
            </p>
            {tool.usageCount && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {tool.usageCount} uses
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}