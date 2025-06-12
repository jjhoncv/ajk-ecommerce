import { ProductVariantData } from '@/services/product/productVariant'
import Link from 'next/link'
import React from 'react'
import ProductImageSlider from './ProductImageSlider'
import ProductVariantActions from './ProductVariantActions'

interface ProductVariantViewProps {
  data: ProductVariantData
}

const ProductVariantView: React.FC<ProductVariantViewProps> = ({ data }) => {
  const { variant, product } = data

  // Obtener atributos de la variante
  const variantAttributes = variant.variantAttributeOptions?.map((vao) => ({
    name: vao.attributeOption?.value || '',
    attributeId: vao.attributeOption?.attributeId
  })) || []

  return (
    <main className="max-w-[1920px] mx-auto px-12 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
          <li>/</li>
          <li><Link href="/search" className="hover:text-primary">Productos</Link></li>
          <li>/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      {/* Layout de 3 columnas */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Columna 1: Galería de imágenes (4 columnas) */}
        <div className="xl:col-span-4">
          <ProductImageSlider images={variant.attributeImages} productName={product.name} />
        </div>

        {/* Columna 2: Información del producto (5 columnas) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Título y SKU */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600">
              SKU: {variant.sku}
            </p>
          </div>

          {/* Precio */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-red-600">
                S/ {variant.price}
              </span>
              {variant.promotion && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    S/ {variant.promotion.promotionPrice}
                  </span>
                  <span className="text-sm font-semibold bg-red-100 text-red-600 px-2 py-1 rounded">
                    {variant.promotion.discountType === 'percentage'
                      ? `-${variant.promotion.discountValue}%`
                      : `- S/ ${variant.promotion.discountValue}`}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Ratings */}
          {variant.ratings && variant.ratings.averageRating && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(variant.ratings!.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {variant.ratings.averageRating} ({variant.ratings.totalRatings} reseñas)
                </span>
              </div>
            </div>
          )}

          {/* Atributos/Características */}
          {variantAttributes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Características:</h3>
              <div className="space-y-2">
                {variantAttributes.map((attr, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                      {attr.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          {product.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Descripción:</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Información adicional */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Categorías</h5>
              <div className="flex flex-wrap gap-2">
                {product.productCategories?.find(item => item?.productId === product.id)?.categories?.map((categorie) => (
                  <span key={categorie?.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {categorie?.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-1">Marca</h5>
              <span className="text-gray-600">{product?.brand?.name}</span>
            </div>
          </div>
        </div>

        {/* Columna 3: Sección de compra (3 columnas) */}
        <div className="xl:col-span-3">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            {/* Stock */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Stock disponible:</span>
                <span className={`text-sm font-medium ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {variant.stock > 0 ? `${variant.stock} unidades` : 'Agotado'}
                </span>
              </div>
            </div>

            {/* Precio destacado */}
            <div className="mb-6">
              <div className="text-2xl font-bold text-red-600 mb-1">
                S/ {variant.price}
              </div>
              {variant.promotion && (
                <div className="text-sm text-gray-500 line-through">
                  Antes: S/ {variant.promotion.promotionPrice}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <ProductVariantActions
              stock={variant.stock}
              variantId={variant.id}
              price={Number(variant.price)}
            />

            {/* Información de envío */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Envío gratis a partir de S/ 100</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Garantía de 1 año</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Pago seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductVariantView
