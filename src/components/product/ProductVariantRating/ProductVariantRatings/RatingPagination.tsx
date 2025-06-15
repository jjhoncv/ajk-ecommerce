interface RatingPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const RatingPagination: React.FC<RatingPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border ${currentPage === 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 rounded border ${currentPage === pageNum
                ? "bg-indigo-600 text-white border-indigo-600"
                : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border ${currentPage === totalPages
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
        >
          Siguiente
        </button>
      </nav>
    </div>
  );
};