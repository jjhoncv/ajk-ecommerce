import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import { SearchFilters, SearchResults, StickyFilters } from '@/module/search/components'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import { getFilters } from '@/module/search/helpers/search.helpers'
import SearchService from '@/module/search/services'
import categoryService from '@/module/categories/service/category'
import { CategoryBanner } from '@/module/categories/components/CategoryBanner'
import { CategoryBreadcrumb } from '@/module/categories/components/CategoryBreadcrumb'
import { type SearchParams } from '@/module/shared/types/shared'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params

  const category = await categoryService.getCategoryBySlug(slug)

  if (!category) {
    return { title: 'Categoría no encontrada' }
  }

  return {
    title: category.metaTitle || `${category.name} | AJK E-commerce`,
    description: category.metaDescription || category.description || `Explora nuestra colección de ${category.name}`
  }
}

export default async function CategoryPage({
  params,
  searchParams
}: CategoryPageProps) {
  const { slug } = await params

  // Get category data by slug
  const category = await categoryService.getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  // Get category ancestors for breadcrumb
  const ancestors = await categoryService.getCategoryAncestors(category.id)

  // Get subcategories
  const subcategories = await categoryService.getCategoriesByParent(category.id)

  // Parse search params and add category filter
  const urlParams = await searchParams
  const filters = {
    ...getFilters(urlParams),
    categoryId: category.id // Force category filter
  }

  // Get products and filters for this category
  const {
    page,
    products,
    totalPages,
    filters: availableFilters
  } = await SearchService.getSearchParams(filters)

  // Modify available filters to show subcategories instead of main category filter
  const modifiedFilters = {
    ...availableFilters,
    // Replace categories with subcategories if they exist
    categories: subcategories.length > 0
      ? subcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          count: 0 // Will be calculated by search
        }))
      : []
  }

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>

      {/* Category Banner */}
      <CategoryBanner category={category} />

      <LayoutContent className="px-0 py-0">
        <div className="mx-auto max-w-screen-4xl px-6 lg:px-12">
          {/* Breadcrumb */}
          <CategoryBreadcrumb
            ancestors={ancestors}
            currentCategory={category.name}
          />

          {/* Category Header */}
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            {category.description && (
              <p className="mt-2 text-gray-600">{category.description}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              {products.length > 0
                ? `${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`
                : 'No hay productos en esta categoría'}
            </p>
          </div>
        </div>

        <div className="mx-auto flex max-w-screen-4xl flex-col gap-8 px-6 lg:flex-row lg:px-12">
          {/* Filtros laterales */}
          <div className="lg:min-w-56 lg:max-w-56">
            <StickyFilters>
              <SearchFilters
                availableFilters={modifiedFilters}
                currentFilters={filters}
                hideMainCategoryFilter={true}
              />
            </StickyFilters>
          </div>

          {/* Resultados */}
          <div className="w-full">
            <SearchResults
              products={products}
              totalPages={totalPages}
              currentPage={page}
              currentFilters={filters}
              defaultView="grid"
            />
          </div>
        </div>
      </LayoutContent>
    </Layout>
  )
}
