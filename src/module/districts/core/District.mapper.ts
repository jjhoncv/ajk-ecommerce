import { type DistrictRaw, type DistrictZone } from './District.repository'

export interface District {
  id: number
  code: string
  name: string
  zone: DistrictZone
  zoneName: string
  isActive: boolean
}

const zoneNames: Record<DistrictZone, string> = {
  lima_centro: 'Lima Centro',
  lima_norte: 'Lima Norte',
  lima_sur: 'Lima Sur',
  lima_este: 'Lima Este',
  callao: 'Callao'
}

export const DistrictMapper = (data: DistrictRaw): District => {
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    zone: data.zone,
    zoneName: zoneNames[data.zone] || data.zone,
    isActive: data.is_active === 1
  }
}

export const DistrictsMapper = (data: DistrictRaw[] | null): District[] | undefined => {
  if (data === null) return undefined
  return data.map(DistrictMapper)
}
