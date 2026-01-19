import { CartItemSkeleton } from './CartItemSkeleton'
import { CartSummarySkeleton } from './CartSummarySkeleton'

export const CartPageSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pt-4">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Lista de productos skeleton */}
        <div className="xl:col-span-8">
          {/* Header de selección skeleton */}
          <div className="mb-4 border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>

          {/* Items skeleton */}
          <div className="space-y-3.5">
            {[1, 2, 3].map((i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Summary skeleton */}
        <div className="xl:col-span-4">
          <CartSummarySkeleton />
        </div>
      </div>
    </div>
  )
}
