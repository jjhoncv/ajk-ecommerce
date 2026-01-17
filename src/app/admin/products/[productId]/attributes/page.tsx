import attributeModel from '@/backend/attribute'
import productModel from '@/backend/product'
import productAttributeOptionModel from '@/backend/product-attribute-option'
import { ProductAttributeManager } from '@/module/products/components/admin/attributes/ProductAttributeManager'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0

interface ProductAttributesPageProps {
  params: Promise<{ productId: string }>
}

export default async function ProductAttributesPage({
  params
}: ProductAttributesPageProps): Promise<JSX.Element> {
  const { productId } = await params
  const product = await productModel.getProductById(Number(productId))

  if (!product) {
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

  // Obtener solo los atributos base (Color, Almacenamiento, etc.) sin opciones
  const attributes = await attributeModel.getAttributes()

  // Obtener opciones ya creadas para este producto con sus opciones agrupadas
  const assignedAttributes = await productAttributeOptionModel.getProductAttributesWithOptions(
    Number(productId)
  )

  // Obtener estadísticas de uso
  const usageStats = await productAttributeOptionModel.getUsageStats(Number(productId))

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Opciones del Producto" />}
        subtitle={`Configurar opciones específicas para: ${product.name}`}
        breadcrumb={[
          { label: 'Productos', url: '/admin/products' },
          { label: product.name, url: `/admin/products/${productId}` },
          { label: 'Opciones' }
        ]}
      >
        <ProductAttributeManager
          productId={Number(productId)}
          productName={product.name}
          attributes={attributes || []}
          assignedAttributes={assignedAttributes || []}
          usageStats={usageStats || []}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
