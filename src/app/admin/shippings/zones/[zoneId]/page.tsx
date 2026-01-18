import { shippingZoneModel } from '@/module/shippings/core'
import { ShippingZoneForm } from '@/module/shippings/components/admin/ShippingZoneForm'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0

interface EditShippingZonePageProps {
  params: Promise<{ zoneId: string }>
}

export default async function EditShippingZonePage({
  params
}: EditShippingZonePageProps): Promise<JSX.Element> {
  const { zoneId } = await params
  const zone = await shippingZoneModel.getShippingZoneById(Number(zoneId))

  if (!zone) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Error" />}
          breadcrumb={[
            { label: 'Envíos', url: '/admin/shippings' },
            { label: 'Zonas', url: '/admin/shippings/zones' }
          ]}
        >
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600">No se encontró la zona de envío</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  // Parsear distritos
  let districts: Array<{ name: string; province: string; department: string }> = []
  if (zone.districts) {
    let rawDistricts: any[] = []
    if (Array.isArray(zone.districts)) {
      rawDistricts = zone.districts
    } else if (typeof zone.districts === 'string') {
      try {
        rawDistricts = JSON.parse(zone.districts)
      } catch {
        rawDistricts = []
      }
    }
    // Filtrar solo distritos válidos con todas las propiedades requeridas
    districts = rawDistricts.filter(
      (d): d is { name: string; province: string; department: string } =>
        d &&
        typeof d === 'object' &&
        typeof d.name === 'string' &&
        typeof d.province === 'string' &&
        typeof d.department === 'string' &&
        d.name.trim() !== '' &&
        d.province.trim() !== '' &&
        d.department.trim() !== ''
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Zona de Envío" />}
        subtitle={`Editando: ${zone.name}`}
        breadcrumb={[
          { label: 'Envíos', url: '/admin/shippings' },
          { label: 'Zonas', url: '/admin/shippings/zones' },
          { label: 'Editar' }
        ]}
      >
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <ShippingZoneForm
            type="edit"
            initialData={{
              id: zone.id,
              name: zone.name,
              districts,
              isActive: zone.isActive ?? 1
            }}
          />
        </div>
      </PageUI>
    </LayoutPageAdmin>
  )
}
