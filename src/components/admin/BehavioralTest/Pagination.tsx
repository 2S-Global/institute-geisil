import { useMemo } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {



  // console.log(' page, totalPages,', page, totalPages,)
  const pages = useMemo(() => {
    const result = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    result.push(1);

    if (page > 3) {
      result.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    if (page < totalPages - 2) {
      result.push("...");
    }

    result.push(totalPages);

    return result;
  }, [page, totalPages]);

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        justify-center
        gap-2
        mt-6
      "
    >
      {/* Previous */}
      <button
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        className="
          px-3 py-2
          text-sm
          rounded-lg
          bg-gray-200
          hover:bg-gray-300
          disabled:opacity-50
          transition
        "
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">←</span>
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pages.map((item, index) =>
          item === "..." ? (
            <span
              key={`dots-${index}`}
              className="
                px-3 py-2
                text-gray-500
              "
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${item}-${index}`}
              onClick={() => setPage(item as number)}
              className={`
                min-w-[40px]
                h-10
                rounded-lg
                text-sm
                transition

                ${page === item
                  ? "bg-[#112B5F] text-white"
                  : "bg-gray-100 hover:bg-gray-200"
                }
              `}
            >
              {item}
            </button>
          ),
        )}
      </div>

      {/* Next */}
      <button
        disabled={page >= totalPages || totalPages === 0}
        onClick={() => setPage(page + 1)}
        className="
          px-3 py-2
          text-sm
          rounded-lg
          bg-gray-200
          hover:bg-gray-300
          disabled:opacity-50
          transition
        "
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">→</span>
      </button>
    </div>
  );
}
