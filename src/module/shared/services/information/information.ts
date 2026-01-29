import StoreConfigService from '@/module/shared/services/store-config'
import { type Information } from './types'

// Iconos SVG para cada tipo de información
const ICONS = {
  address:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-4 w-4"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  hours:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock h-4 w-4"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
}

export const getInformation = async (): Promise<Information[]> => {
  const config = await StoreConfigService.getStoreConfig()

  if (!config) {
    return []
  }

  const information: Information[] = []

  if (config.address) {
    information.push({
      description: config.address,
      icon: ICONS.address
    })
  }

  if (config.businessHours) {
    information.push({
      description: config.businessHours,
      icon: ICONS.hours
    })
  }

  return information
}
