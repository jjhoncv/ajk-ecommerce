'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react'

interface MapPickerProps {
  latitude?: number
  longitude?: number
  onLocationChange: (lat: number, lng: number, address?: string) => void
  height?: string
  disabled?: boolean
}

// Lima, Peru center coordinates
const LIMA_CENTER = {
  lat: -12.0464,
  lng: -77.0428
}

export const MapPicker = ({
  latitude,
  longitude,
  onLocationChange,
  height = '300px',
  disabled = false
}: MapPickerProps) => {
  const [isClient, setIsClient] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  const initialLat = latitude || LIMA_CENTER.lat
  const initialLng = longitude || LIMA_CENTER.lng

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      // Create map
      const map = L.map(mapContainerRef.current!, {
        center: [initialLat, initialLng],
        zoom: latitude && longitude ? 16 : 12,
      })

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map)

      // Add draggable marker
      const marker = L.marker([initialLat, initialLng], {
        draggable: !disabled
      }).addTo(map)

      // Handle marker drag
      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng()
        reverseGeocode(lat, lng)
      })

      // Handle map click
      map.on('click', (e: any) => {
        if (disabled) return
        const { lat, lng } = e.latlng
        marker.setLatLng([lat, lng])
        reverseGeocode(lat, lng)
      })

      mapRef.current = map
      markerRef.current = marker
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [isClient, initialLat, initialLng, latitude, longitude, disabled])

  // Update marker position when props change
  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude])
      mapRef.current?.flyTo([latitude, longitude], 16, { duration: 1 })
    }
  }, [latitude, longitude])

  // Reverse geocode to get address from coordinates (using Nominatim - free)
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'es'
          }
        }
      )
      const data = await response.json()
      if (data.display_name) {
        onLocationChange(lat, lng, data.display_name)
      } else {
        onLocationChange(lat, lng)
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error)
      onLocationChange(lat, lng)
    }
  }, [onLocationChange])

  // Search for address using Nominatim (free)
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', Lima, Peru'
        )}&limit=1&countrycodes=pe`,
        {
          headers: {
            'Accept-Language': 'es'
          }
        }
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        const latNum = parseFloat(lat)
        const lngNum = parseFloat(lon)

        if (mapRef.current && markerRef.current) {
          markerRef.current.setLatLng([latNum, lngNum])
          mapRef.current.flyTo([latNum, lngNum], 16, { duration: 1.5 })
        }
        onLocationChange(latNum, lngNum, display_name)
      }
    } catch (error) {
      console.error('Error searching address:', error)
    } finally {
      setSearching(false)
    }
  }, [searchQuery, onLocationChange])

  // Get user's current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada en este navegador')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords
        if (mapRef.current && markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
          mapRef.current.flyTo([lat, lng], 16, { duration: 1.5 })
        }
        reverseGeocode(lat, lng)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('No se pudo obtener tu ubicación. Verifica los permisos.')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  if (!isClient) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
        style={{ height }}
      >
        <div className="text-center p-4">
          <Loader2 className="mx-auto h-8 w-8 text-gray-400 animate-spin mb-2" />
          <p className="text-sm text-gray-500">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />

      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar dirección..."
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={disabled || searching}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {searching ? '...' : 'Buscar'}
        </button>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={disabled}
          className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:bg-gray-100"
          title="Usar mi ubicación actual"
        >
          <Navigation className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="rounded-lg overflow-hidden border border-gray-200"
        style={{ height }}
      />

      {/* Instructions */}
      <p className="text-xs text-gray-500">
        <MapPin className="inline h-3 w-3 mr-1" />
        Arrastra el marcador o haz clic en el mapa para ajustar la ubicación exacta
      </p>
    </div>
  )
}
