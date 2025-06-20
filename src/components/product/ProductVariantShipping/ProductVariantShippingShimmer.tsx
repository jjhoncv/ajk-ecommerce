export const ProductVariantShippingShimmer = () => {
  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
          <div className="h-3 w-3 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="space-y-3 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
              <div className="h-3 w-28 animate-pulse rounded bg-gray-200"></div>
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
        </div>

        <div className="space-y-2 border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
              <div className="h-3 w-40 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="h-3 w-3 animate-pulse rounded bg-gray-200"></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
              <div className="h-3 w-36 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="h-3 w-3 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
