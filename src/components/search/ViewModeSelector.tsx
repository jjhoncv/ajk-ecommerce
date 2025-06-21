'use client'
import { LayoutGrid, List } from 'lucide-react'
import React from 'react'

interface ViewModeSelectorProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border">
      <button
        onClick={() => { onViewModeChange('grid') }}
        className={`flex items-center px-3 py-2 ${
          viewMode === 'grid'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Ver como cuadrícula"
      >
        <LayoutGrid className="mr-1 h-4 w-4" />
        <span className="text-sm">Cuadrícula</span>
      </button>
      <button
        onClick={() => { onViewModeChange('list') }}
        className={`flex items-center px-3 py-2 ${
          viewMode === 'list'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Ver como lista"
      >
        <List className="mr-1 h-4 w-4" />
        <span className="text-sm">Lista</span>
      </button>
    </div>
  )
}

export default ViewModeSelector
