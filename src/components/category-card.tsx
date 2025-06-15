import React from 'react'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  color: string
}

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="block">
      <div className="category-card group">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-3">{category.icon}</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {category.name}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {category.description}
        </p>
      </div>
    </Link>
  )
}