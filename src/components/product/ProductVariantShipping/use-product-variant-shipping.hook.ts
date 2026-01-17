// 📄 hooks/useProductVariantShipping.ts
import {
  type ShippingCalculationResponse,
  type ShippingOptionForAddress
} from '@/types/shipping'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface ShippingData {
  selectedAddress: ShippingOptionForAddress | null
  allAddresses: ShippingOptionForAddress[]
  loading: boolean
  error: string | null
  isInitialized: boolean
  hasAddresses: boolean
  hasShippingOptions: boolean
}

interface UseProductVariantShippingProps {
  productVariantId: number
  quantity: number
  orderValue: number
}

interface UseProductVariantShippingReturn extends ShippingData {
  selectAddress: (addressOption: ShippingOptionForAddress) => void
  retry: () => void
}

export const useProductVariantShipping = ({
  productVariantId,
  quantity,
  orderValue
}: UseProductVariantShippingProps): UseProductVariantShippingReturn => {
  const { data: session, status } = useSession()

  const [shippingData, setShippingData] = useState<ShippingData>({
    selectedAddress: null,
    allAddresses: [],
    loading: true,
    error: null,
    isInitialized: false,
    hasAddresses: false,
    hasShippingOptions: false
  })

  const loadShippingData = async () => {
    // No hacer nada hasta que la sesión esté resuelta
    if (status === 'loading') return

    try {
      if (session?.user?.id) {
        // Usuario logueado: obtener todas las direcciones y calcular envío
        const response = await fetch('/api/shipping/calculate-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productVariantId,
            quantity,
            orderValue
          })
        })

        if (!response.ok) {
          throw new Error('Error al calcular envío')
        }

        const data: ShippingCalculationResponse = await response.json()

        setShippingData({
          selectedAddress: data.defaultAddress,
          allAddresses: data.allAddresses || [],
          loading: false,
          error: null,
          isInitialized: true,
          hasAddresses: data.hasAddresses ?? false,
          hasShippingOptions: data.hasShippingOptions ?? false
        })
      } else {
        // Usuario no logueado: mostrar envío genérico
        setShippingData({
          selectedAddress: null,
          allAddresses: [],
          loading: false,
          error: null,
          isInitialized: true,
          hasAddresses: false,
          hasShippingOptions: false
        })
      }
    } catch (error) {
      console.error('Error loading shipping data:', error)
      setShippingData({
        selectedAddress: null,
        allAddresses: [],
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al cargar información de envío',
        isInitialized: true,
        hasAddresses: false,
        hasShippingOptions: false
      })
    }
  }

  // Efecto principal para cargar datos
  useEffect(() => {
    loadShippingData()
  }, [session, status, productVariantId, quantity, orderValue])

  // Función para seleccionar dirección
  const selectAddress = (addressOption: ShippingOptionForAddress) => {
    setShippingData((prev) => ({
      ...prev,
      selectedAddress: addressOption
    }))
  }

  // Función para reintentar
  const retry = () => {
    setShippingData((prev) => ({
      ...prev,
      loading: true,
      error: null,
      isInitialized: false,
      hasAddresses: false,
      hasShippingOptions: false
    }))
    loadShippingData()
  }

  return {
    ...shippingData,
    selectAddress,
    retry
  }
}
