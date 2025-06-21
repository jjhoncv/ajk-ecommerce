import { type ShippingCalculation } from '@/backend/shipping-zone-method'

export const deliveryDates = (defaultShipping: ShippingCalculation) => {
  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() + defaultShipping.estimatedDays.min)

  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + defaultShipping.estimatedDays.max)

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short'
  }

  return {
    min: minDate.toLocaleDateString('es-PE', formatOptions).toUpperCase(),
    max: maxDate.toLocaleDateString('es-PE', formatOptions).toUpperCase()
  }
}
