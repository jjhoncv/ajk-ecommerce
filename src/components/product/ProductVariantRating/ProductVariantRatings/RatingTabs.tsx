interface RatingTabsProps {
  activeTab: 'variant' | 'product'
  onTabChange: (tab: 'variant' | 'product') => void
  variantCount: number
  productCount: number
}

export const RatingTabs: React.FC<RatingTabsProps> = ({
  activeTab,
  onTabChange,
  variantCount,
  productCount
}) => {
  return (
    <div className="mb-4 border-b border-gray-200">
      <div className="flex">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'variant'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('variant')}
        >
          Esta variante ({variantCount})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'product'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('product')}
        >
          Todas las variantes ({productCount})
        </button>
      </div>
    </div>
  )
}
