'use client'
import { type Category } from '@/module/categories/service/category/types'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { PreviewImageList } from '@/module/shared/components/PreviewImageList'
import { RemoveAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface CategoryWithSubcategories extends Category {
  hasSubcategories: boolean
}

interface CategoryListViewProps {
  categories: CategoryWithSubcategories[]
  parentId?: number | null
  parentCategory?: Category | null
}

export const CategoryListView: FC<CategoryListViewProps> = ({
  categories,
  parentId = null,
  parentCategory = null
}) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'displayOrder',
      label: '#',
      priority: 'high',
      sortable: true,
      width: '50px',
      render: (order: number) => (
        <span className="text-sm font-medium text-gray-500">{order}</span>
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '200px'
    },
    {
      key: 'description',
      label: 'Descripción',
      priority: 'medium',
      sortable: true,
      searchable: true,
      width: '300px'
    },
    {
      key: 'imageUrl',
      label: 'Imagen',
      priority: 'high',
      sortable: false,
      render: (imageURL: string) => <PreviewImageList imageURL={imageURL} />,
      width: '100px'
    },
    {
      key: 'showNav',
      label: 'En Menú',
      priority: 'high',
      sortable: true,
      width: '90px',
      render: (showNav: boolean) =>
        showNav ? (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            Visible
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
            Oculto
          </span>
        )
    },
    {
      key: 'parentId',
      label: 'Categoría Padre',
      priority: 'medium',
      sortable: true,
      render: (categoryParentId: number | null) => {
        if (categoryParentId == null) {
          return (
            <span className="text-sm text-gray-600">Categoría Principal</span>
          )
        }

        // Si tenemos información de la categoría padre desde el servidor, usarla
        if (parentCategory != null && parentCategory.id === categoryParentId) {
          return (
            <span className="text-sm text-gray-600">{parentCategory.name}</span>
          )
        }

        // Buscar en las categorías actuales como fallback
        const foundParent = categories.find(
          (cat) => cat.id === categoryParentId
        )
        return (
          <span className="text-sm text-gray-600">
            {foundParent?.name ?? `ID: ${categoryParentId}`}
          </span>
        )
      },
      width: '150px'
    },
    {
      key: 'id',
      label: 'Subcategorías',
      priority: 'medium',
      sortable: false,
      render: (id: number) => {
        const category = categories.find((cat) => cat.id === id)
        if (category != null && category.hasSubcategories) {
          return (
            <Link
              href={`/admin/categories?parent=${id}`}
              className="inline-flex items-center gap-2 rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200"
            >
              <FolderOpen size={14} />
              Ver subcategorías
            </Link>
          )
        }
        return <span className="text-sm text-gray-500">Sin subcategorías</span>
      },
      width: '150px'
    }
  ]

  const handleRemoveCategory = async (id: string | null): Promise<void> => {
    if (id == null || id === '') return
    try {
      const message = await FetchCustomBody({
        data: { id },
        method: 'DELETE',
        url: '/api/admin/categories'
      })

      ToastSuccess(message)

      // Mantener el contexto de navegación
      const currentUrl =
        parentId != null
          ? `/admin/categories?parent=${parentId}`
          : '/admin/categories'

      router.push(currentUrl)
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido'
      ToastFail(errorMessage)
    }
  }

  const handleReorder = async (
    reorderedItems: Array<Record<string, unknown>>
  ): Promise<void> => {
    try {
      // Crear array con los IDs y sus nuevos órdenes
      const orderUpdates = reorderedItems.map((item, index) => ({
        id: item.id as number,
        display_order: index + 1
      }))

      await FetchCustomBody({
        data: { orders: orderUpdates },
        method: 'PUT',
        url: '/api/admin/categories'
      })

      ToastSuccess('Orden actualizado correctamente')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar el orden'
      ToastFail(errorMessage)
    }
  }

  return (
    <>
      <Alert
        message="¿Estás seguro de eliminar esta categoría?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemoveCategory(id)
        }}
        onCancel={() => {
          router.replace('/admin/categories')
        }}
      />
      <DynamicTable
        columns={columns}
        data={categories}
        renderActions={(id: string) => {
          const editUrl =
            parentId != null
              ? `/admin/categories/${id}?parent=${parentId}`
              : `/admin/categories/${id}`

          return (
            <>
              <Link
                href={editUrl}
                className="flex cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </Link>
              <RemoveAction id={id} baseURL="/admin/categories" />
            </>
          )
        }}
        enableSearch
        enablePagination
        enableSort
        enableReorder
        onReorder={handleReorder}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </>
  )
}
