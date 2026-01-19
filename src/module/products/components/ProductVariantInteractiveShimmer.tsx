// 👈 COMPONENTE BASE DE SHIMMER
const ShimmerBox = ({
  className = '',
  children
}: {
  className?: string
  children?: React.ReactNode
}) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`}>
    {children}
  </div>
)

const ShimmerText = ({ className = '' }: { className?: string }) => (
  <ShimmerBox className={`h-4 ${className}`} />
)

const ShimmerButton = ({ className = '' }: { className?: string }) => (
  <ShimmerBox className={`h-12 ${className}`} />
)

// 👈 SHIMMER PRINCIPAL DEL PRODUCTO (Estructura correcta)
export const ProductVariantInteractiveShimmer = () => {
  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
      {/* 👈 CONTENIDO PRINCIPAL - 9 columnas */}
      <div className="xl:col-span-9">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* 👈 IMAGEN DEL PRODUCTO */}
          <div className="xl:col-span-1">
            <ShimmerBox className="mb-4 aspect-square w-full" />
          </div>

          {/* 👈 INFORMACIÓN DEL PRODUCTO */}
          <div className="space-y-5 xl:col-span-1">
            {/* ProductVariantInfo */}
            <div className="space-y-4">
              {/* Precio */}
              <ShimmerText className="h-8 w-32" />

              {/* Título y descripción */}
              <div className="space-y-2">
                <ShimmerText className="h-6 w-full" />
                <ShimmerText className="h-4 w-3/4" />
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-gray-200 pt-6">
              {/* ProductVariantAttributeSelector */}
              <div className="space-y-6">
                {/* Color */}
                <div className="space-y-3">
                  <ShimmerText className="h-4 w-16" />
                  <div className="flex gap-2">
                    <ShimmerBox className="h-12 w-16" />
                    <ShimmerBox className="h-12 w-16" />
                  </div>
                </div>

                {/* Tamaño */}
                <div className="space-y-3">
                  <ShimmerText className="h-4 w-20" />
                  <ShimmerBox className="h-12 w-32" />
                </div>

                {/* Almacenamiento */}
                <div className="space-y-3">
                  <ShimmerText className="h-4 w-28" />
                  <div className="flex gap-2">
                    <ShimmerBox className="h-10 w-20" />
                    <ShimmerBox className="h-10 w-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 👈 RATINGS SECTION (solo si no es preview) */}
        {/* <div className="mt-8">
          <div className="space-y-4">
            <ShimmerText className="w-32 h-6" />
            <div className="flex gap-1">
              <ShimmerBox className="w-5 h-5" />
              <ShimmerBox className="w-5 h-5" />
              <ShimmerBox className="w-5 h-5" />
              <ShimmerBox className="w-5 h-5" />
              <ShimmerBox className="w-5 h-5" />
              <ShimmerText className="w-20 h-4 ml-2" />
            </div>
            <div className="space-y-3">
              <ShimmerText className="w-full h-4" />
              <ShimmerText className="w-3/4 h-4" />
              <ShimmerText className="w-1/2 h-4" />
            </div>
          </div>
        </div> */}
      </div>

      {/* 👈 SIDEBAR DE COMPRA - 3 columnas */}
      <div className="xl:col-span-3">
        <div className="sticky top-4 space-y-4 rounded-lg border p-6">
          {/* Envío */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <ShimmerText className="h-4 w-16" />
              <ShimmerText className="h-4 w-12" />
            </div>
            <ShimmerText className="h-4 w-full" />
          </div>

          {/* Política de envío */}
          {/* <div className="space-y-2">
            <ShimmerBox className="w-6 h-6 rounded-full" />
            <ShimmerText className="w-32 h-4" />
          </div> */}

          {/* Política de devoluciones */}
          <div className="space-y-2">
            <ShimmerBox className="h-6 w-6 rounded-full" />
            <ShimmerText className="h-4 w-40" />
          </div>

          {/* Seguridad */}
          <div className="space-y-2">
            <ShimmerBox className="h-6 w-6 rounded-full" />
            <ShimmerText className="h-4 w-36" />
          </div>

          {/* Cantidad */}
          <div className="space-y-3">
            <ShimmerText className="h-4 w-20" />
            <div className="flex items-center justify-between rounded-lg border p-2">
              <ShimmerBox className="h-6 w-6" />
              <ShimmerText className="h-4 w-6" />
              <ShimmerBox className="h-6 w-6" />
            </div>
            <ShimmerText className="h-4 w-24" />
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <ShimmerButton className="w-full bg-blue-200" />
            <ShimmerButton className="w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
