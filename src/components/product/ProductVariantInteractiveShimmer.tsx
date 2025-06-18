// 👈 COMPONENTE BASE DE SHIMMER
const ShimmerBox = ({ className = "", children }: { className?: string; children?: React.ReactNode }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
    {children}
  </div>
);

const ShimmerText = ({ className = "" }: { className?: string }) => (
  <ShimmerBox className={`h-4 ${className}`} />
);

const ShimmerButton = ({ className = "" }: { className?: string }) => (
  <ShimmerBox className={`h-12 ${className}`} />
);

// 👈 SHIMMER PRINCIPAL DEL PRODUCTO (Estructura correcta)
export const ProductVariantInteractiveShimmer = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

      {/* 👈 CONTENIDO PRINCIPAL - 9 columnas */}
      <div className="xl:col-span-9">
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

          {/* 👈 IMAGEN DEL PRODUCTO */}
          <div className="xl:col-span-1">
            <ShimmerBox className="w-full aspect-square mb-4" />
          </div>

          {/* 👈 INFORMACIÓN DEL PRODUCTO */}
          <div className='xl:col-span-1 space-y-5'>

            {/* ProductVariantInfo */}
            <div className="space-y-4">
              {/* Precio */}
              <ShimmerText className="w-32 h-8" />

              {/* Título y descripción */}
              <div className="space-y-2">
                <ShimmerText className="w-full h-6" />
                <ShimmerText className="w-3/4 h-4" />
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-gray-200 pt-6">
              {/* ProductVariantAttributeSelector */}
              <div className="space-y-6">

                {/* Color */}
                <div className="space-y-3">
                  <ShimmerText className="w-16 h-4" />
                  <div className="flex gap-2">
                    <ShimmerBox className="w-16 h-12" />
                    <ShimmerBox className="w-16 h-12" />
                  </div>
                </div>

                {/* Tamaño */}
                <div className="space-y-3">
                  <ShimmerText className="w-20 h-4" />
                  <ShimmerBox className="w-32 h-12" />
                </div>

                {/* Almacenamiento */}
                <div className="space-y-3">
                  <ShimmerText className="w-28 h-4" />
                  <div className="flex gap-2">
                    <ShimmerBox className="w-20 h-10" />
                    <ShimmerBox className="w-20 h-10" />
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
        <div className="border rounded-lg p-6 space-y-4 sticky top-4">

          {/* Envío */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <ShimmerText className="w-16 h-4" />
              <ShimmerText className="w-12 h-4" />
            </div>
            <ShimmerText className="w-full h-4" />
          </div>

          {/* Política de envío */}
          {/* <div className="space-y-2">
            <ShimmerBox className="w-6 h-6 rounded-full" />
            <ShimmerText className="w-32 h-4" />
          </div> */}

          {/* Política de devoluciones */}
          <div className="space-y-2">
            <ShimmerBox className="w-6 h-6 rounded-full" />
            <ShimmerText className="w-40 h-4" />
          </div>

          {/* Seguridad */}
          <div className="space-y-2">
            <ShimmerBox className="w-6 h-6 rounded-full" />
            <ShimmerText className="w-36 h-4" />
          </div>

          {/* Cantidad */}
          <div className="space-y-3">
            <ShimmerText className="w-20 h-4" />
            <div className="flex items-center justify-between border rounded-lg p-2">
              <ShimmerBox className="w-6 h-6" />
              <ShimmerText className="w-6 h-4" />
              <ShimmerBox className="w-6 h-6" />
            </div>
            <ShimmerText className="w-24 h-4" />
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <ShimmerButton className="w-full bg-blue-200" />
            <ShimmerButton className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};