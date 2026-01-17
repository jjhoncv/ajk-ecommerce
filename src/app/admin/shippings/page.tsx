import shippingMethodModel from '@/backend/shipping-method'
import shippingZoneModel from '@/backend/shipping-zone'
import shippingZoneMethodModel from '@/backend/shipping-zone-method'
import { ZoneMethodPricingManager } from '@/module/shippings/components/admin/ZoneMethodPricingManager'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { ChevronRight, MapPin, Truck } from 'lucide-react'
import Link from 'next/link'
import { type JSX } from 'react'

export const revalidate = 0

export default async function ShippingsPage(): Promise<JSX.Element> {
  const methods = await shippingMethodModel.getAllShippingMethods()
  const zones = await shippingZoneModel.getAllShippingZones()
  const zoneMethods = await shippingZoneMethodModel.getAllZoneMethodsWithDetails()

  const methodsCount = methods?.length ?? 0
  const zonesCount = zones?.length ?? 0

  const activeMethodsCount = methods?.filter(m => m.isActive === 1).length ?? 0
  const activeZonesCount = zones?.filter(z => z.isActive === 1).length ?? 0

  // Mapear datos para el componente
  const methodsForManager = (methods ?? []).map(m => ({
    id: m.id,
    name: m.name,
    isActive: m.isActive ?? 1
  }))

  const zonesForManager = (zones ?? []).map(z => ({
    id: z.id,
    name: z.name,
    isActive: z.isActive ?? 1
  }))

  const zoneMethodsForManager = (zoneMethods ?? []).map(zm => ({
    id: zm.id,
    shippingMethodId: zm.shippingMethodId,
    shippingZoneId: zm.shippingZoneId,
    cost: zm.cost,
    freeShippingThreshold: zm.freeShippingThreshold ?? null,
    estimatedDaysMin: zm.estimatedDaysMin ?? null,
    estimatedDaysMax: zm.estimatedDaysMax ?? null,
    isActive: zm.isActive ?? 1,
    methodName: zm.methodName,
    zoneName: zm.zoneName
  }))

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Envíos" />}
        subtitle="Gestión de métodos y zonas de envío"
        breadcrumb={[{ label: 'Envíos' }]}
      >
        <div className="space-y-6">
          {/* Tarjetas de resumen */}
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/admin/shippings/methods"
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Métodos de Envío</h3>
                  <p className="text-sm text-gray-500">
                    {methodsCount} método{methodsCount !== 1 ? 's' : ''}
                    <span className="text-green-600"> ({activeMethodsCount} activo{activeMethodsCount !== 1 ? 's' : ''})</span>
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
            </Link>

            <Link
              href="/admin/shippings/zones"
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-purple-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Zonas de Envío</h3>
                  <p className="text-sm text-gray-500">
                    {zonesCount} zona{zonesCount !== 1 ? 's' : ''}
                    <span className="text-green-600"> ({activeZonesCount} activa{activeZonesCount !== 1 ? 's' : ''})</span>
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-purple-600" />
            </Link>
          </div>

          {/* Matriz de precios */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold">Matriz de Precios</h2>
              <p className="text-sm text-gray-500">
                Configura los precios de envío por método y zona. Haz clic en una celda para editar.
              </p>
            </div>

            <div className="p-4">
              <ZoneMethodPricingManager
                methods={methodsForManager}
                zones={zonesForManager}
                zoneMethods={zoneMethodsForManager}
              />
            </div>
          </div>
        </div>
      </PageUI>
    </LayoutPageAdmin>
  )
}
