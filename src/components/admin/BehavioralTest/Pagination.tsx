import { useMemo } from "react";

export default function Pagination({ page, totalPages, setPage }) {
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
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="
          px-3 py-2
          text-sm
          rounded-lg
          bg-gray-200
          hover:bg-gray-300
          disabled:opacity-50
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
              key={index}
              className="
                px-3 py-2
                text-gray-500
              "
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={`
                min-w-[40px]
                h-10
                rounded-lg
                text-sm
                transition

                ${
                  page === item
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
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="
          px-3 py-2
          text-sm
          rounded-lg
          bg-[#112B5F]
          text-white
          hover:bg-[#0d2148]
          disabled:opacity-50
        "
      >
        <span className="hidden sm:inline">Next</span>

        <span className="sm:hidden">→</span>
      </button>
    </div>
  );
}
