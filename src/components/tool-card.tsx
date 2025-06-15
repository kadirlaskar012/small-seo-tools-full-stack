import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Tool {
  id: number
  title: string
  slug: string
  description: string
  category: {
    name: string
    color: string
  }
}

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`} className="block">
      <div className="tool-card group">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {tool.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {tool.description}
        </p>
      </div>
    </Link>
  )
}