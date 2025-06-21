interface RatingPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const RatingPagination: React.FC<RatingPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex justify-center">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => { onPageChange(currentPage - 1) }}
          disabled={currentPage === 1}
          className={`rounded border px-3 py-1 ${
            currentPage === 1
              ? 'cursor-not-allowed border-gray-200 text-gray-400'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => { onPageChange(pageNum) }}
            className={`rounded border px-3 py-1 ${
              currentPage === pageNum
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => { onPageChange(currentPage + 1) }}
          disabled={currentPage === totalPages}
          className={`rounded border px-3 py-1 ${
            currentPage === totalPages
              ? 'cursor-not-allowed border-gray-200 text-gray-400'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Siguiente
        </button>
      </nav>
    </div>
  )
}
