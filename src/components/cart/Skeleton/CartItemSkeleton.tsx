
export const CartItemSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 p-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-200 animate-pulse"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};