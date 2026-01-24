'use client'

import { type VariantActiveOffer } from '@/module/offers/core'
import { useCallback, useEffect, useState } from 'react'

interface UseOfferResult {
  offer: VariantActiveOffer | null
  loading: boolean
  error: string | null
  refetch: () => void
}

interface UseOffersResult {
  offers: Record<number, VariantActiveOffer>
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Hook para obtener la oferta activa de una variante
 */
export function useOffer(variantId: number | null): UseOfferResult {
  const [offer, setOffer] = useState<VariantActiveOffer | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOffer = useCallback(async () => {
    if (!variantId) {
      setOffer(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/offers?variantId=${variantId}`)
      if (!response.ok) throw new Error('Error al obtener oferta')

      const data = await response.json()
      setOffer(data.offer || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setOffer(null)
    } finally {
      setLoading(false)
    }
  }, [variantId])

  useEffect(() => {
    fetchOffer()
  }, [fetchOffer])

  return { offer, loading, error, refetch: fetchOffer }
}

/**
 * Hook para obtener ofertas activas de múltiples variantes
 */
export function useOffers(variantIds: number[]): UseOffersResult {
  const [offers, setOffers] = useState<Record<number, VariantActiveOffer>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = useCallback(async () => {
    if (variantIds.length === 0) {
      setOffers({})
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/offers?variantIds=${variantIds.join(',')}`)
      if (!response.ok) throw new Error('Error al obtener ofertas')

      const data = await response.json()
      setOffers(data.offers || {})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setOffers({})
    } finally {
      setLoading(false)
    }
  }, [variantIds.join(',')])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return { offers, loading, error, refetch: fetchOffers }
}

/**
 * Hook para obtener ofertas destacadas
 */
export function useFeaturedOffers(limit: number = 5) {
  const [offers, setOffers] = useState<VariantActiveOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/offers?featured=true&limit=${limit}`)
      if (!response.ok) throw new Error('Error al obtener ofertas')

      const data = await response.json()
      setOffers(data.offers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setOffers([])
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return { offers, loading, error, refetch: fetchOffers }
}
