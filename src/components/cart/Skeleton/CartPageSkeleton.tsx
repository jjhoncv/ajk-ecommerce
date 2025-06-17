import { CartItemSkeleton } from "@/components/cart/Skeleton/CartItemSkeleton";
import { CartSummarySkeleton } from "@/components/cart/Skeleton/CartSummarySkeleton";
import { ArrowLeft } from "lucide-react";

export const CartPageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 py-6">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4 text-gray-300" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Lista de productos skeleton */}
        <div className="xl:col-span-8">
          {/* Header de selección skeleton */}
          <div className="bg-white border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Promoción skeleton */}
          <div className="bg-gray-200 p-4 mb-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-48 bg-gray-300 rounded"></div>
              </div>
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Items skeleton */}
          <div className="space-y-4">
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
  );
};