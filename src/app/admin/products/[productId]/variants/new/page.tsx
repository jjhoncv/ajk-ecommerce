import productModel from '@/backend/product'
import productAttributeOptionModel from '@/backend/product-attribute-option'
import { VariantForm } from '@/module/products/components/admin/variants/VariantForm'
import { VariantFields } from '@/module/products/components/admin/variants/variantFields'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import Link from 'next/link'
import { type JSX } from 'react'

interface NewVariantPageProps {
  params: Promise<{ productId: string }>
}

export default async function NewVariantPage({
  params
}: NewVariantPageProps): Promise<JSX.Element> {
  const { productId } = await params
  const product = await productModel.getProductById(Number(productId))

  // 🆕 Obtener atributos asignados específicamente a este producto
  const attributes = await productAttributeOptionModel.getProductAttributesWithOptions(
    Number(productId)
  )

  if (product == null) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Error" />}
          breadcrumb={[{ label: 'Productos', url: '/admin/products' }]}
        >
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600">No se encontró el producto</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  // Si no hay atributos asignados, mostrar mensaje
  if (!attributes || attributes.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Nueva Variante" />}
          subtitle={`Crear variante para: ${product.name}`}
          breadcrumb={[
            { label: 'Productos', url: '/admin/products' },
            { label: product.name, url: `/admin/products/${productId}` },
            { label: 'Variantes', url: `/admin/products/${productId}/variants` },
            { label: 'Nueva Variante' }
          ]}
        >
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8">
            <h3 className="mb-3 text-lg font-semibold text-yellow-900">
              ⚠️ No hay atributos configurados
            </h3>
            <p className="mb-4 text-sm text-yellow-800">
              Antes de crear variantes, debes configurar qué atributos y opciones estarán
              disponibles para este producto.
            </p>
            <p className="mb-6 text-sm text-yellow-700">
              Por ejemplo, si este producto tiene opciones de Color y Almacenamiento,
              debes asignar esos atributos y sus opciones específicas primero.
            </p>
            <Link
              href={`/admin/products/${productId}/attributes`}
              className="inline-block rounded bg-yellow-600 px-4 py-2 font-medium text-white transition-colors hover:bg-yellow-700"
            >
              Configurar Atributos del Producto
            </Link>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nueva Variante" />}
        subtitle={`Crear variante para: ${product.name}`}
        breadcrumb={[
          { label: 'Productos', url: '/admin/products' },
          { label: product.name, url: `/admin/products/${productId}` },
          { label: 'Variantes', url: `/admin/products/${productId}/variants` },
          { label: 'Nueva Variante' }
        ]}
      >
        <VariantForm
          type="new"
          productId={productId}
          fields={VariantFields}
          attributes={attributes}
          redirectUrl={`/admin/products/${productId}/variants`}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
