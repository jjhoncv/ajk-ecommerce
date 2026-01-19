export const CartSummarySkeleton = () => {
  return (
    <div className="border border-gray-200 bg-white p-4">
      {/* Título */}
      <div className="mb-4 h-6 w-20 animate-pulse rounded bg-gray-200"></div>

      {/* Imágenes pequeñas */}
      <div className="mb-4 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 w-12 animate-pulse rounded bg-gray-200"
          ></div>
        ))}
      </div>

      {/* Líneas de precio */}
      <div className="mb-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mb-4 border-t pt-4">
        <div className="flex justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Botón */}
      <div className="mb-3 h-12 w-full animate-pulse bg-gray-200"></div>

      {/* Métodos de pago */}
      <div className="mb-4">
        <div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200"></div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-5 w-8 animate-pulse rounded bg-gray-200"
            ></div>
          ))}
        </div>
      </div>

      {/* Protección */}
      <div className="border-t pt-4">
        <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}
