
export const CartSummarySkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 p-4">
      {/* Título */}
      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-4"></div>

      {/* Imágenes pequeñas */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>

      {/* Líneas de precio */}
      <div className="space-y-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Botón */}
      <div className="h-12 w-full bg-gray-200 animate-pulse mb-3"></div>

      {/* Métodos de pago */}
      <div className="mb-4">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-5 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Protección */}
      <div className="border-t pt-4">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};