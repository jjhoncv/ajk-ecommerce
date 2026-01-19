import { getVariantTitle } from '@/module/products/helpers/productVariant.helpers'
import { type Products, type ProductVariants } from '@/types/domain'
import Link from 'next/link'
import { type FC } from 'react'

interface BreadcrumbProps {
  product: Products
  variant: ProductVariants
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ product, variant }) => {
  return (
    <nav className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        <li>
          <Link href="/" className="hover:text-primary">
            Inicio
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link href="/search" className="hover:text-primary">
            Productos
          </Link>
        </li>
        <li>/</li>
        <li className="text-gray-900">
          {getVariantTitle(product.name, variant)}
        </li>
      </ol>
    </nav>
  )
}
