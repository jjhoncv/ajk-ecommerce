export const CartItemSkeleton = () => {
  return (
    <div className="border border-gray-200 bg-white p-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-2">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="flex-shrink-0">
          <div className="h-20 w-20 animate-pulse bg-gray-200"></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
              <div className="mb-3 h-3 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
              <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
