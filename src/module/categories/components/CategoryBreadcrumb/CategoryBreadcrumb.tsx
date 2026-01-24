import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

interface BreadcrumbItem {
  id: number
  name: string
  slug: string
  parentId: number | null
}

interface CategoryBreadcrumbProps {
  ancestors: BreadcrumbItem[]
  currentCategory: string
}

export const CategoryBreadcrumb = ({
  ancestors,
  currentCategory
}: CategoryBreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {/* Home */}
        <li>
          <Link
            href="/"
            className="flex items-center text-gray-500 hover:text-gray-900"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Inicio</span>
          </Link>
        </li>

        <li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </li>

        {/* Ancestor categories */}
        {ancestors.slice(0, -1).map((ancestor) => (
          <li key={ancestor.id} className="flex items-center gap-1">
            <Link
              href={`/categoria/${ancestor.slug}`}
              className="text-gray-500 hover:text-gray-900 hover:underline"
            >
              {ancestor.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </li>
        ))}

        {/* Current category */}
        <li>
          <span className="font-medium text-gray-900" aria-current="page">
            {currentCategory}
          </span>
        </li>
      </ol>
    </nav>
  )
}
