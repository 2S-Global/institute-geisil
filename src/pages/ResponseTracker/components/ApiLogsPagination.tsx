import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ApiLogsPaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  totalPages: number;
  totalLogs: number;
}

export const ApiLogsPagination: React.FC<ApiLogsPaginationProps> = ({
  page,
  setPage,
  loading,
  totalPages,
  totalLogs,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (page > 3) {
        pages.push('...');
      }
      
      // Determine middle range
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      let adjustedStart = start;
      let adjustedEnd = end;
      
      if (page <= 3) {
        adjustedEnd = 4;
      } else if (page >= totalPages - 2) {
        adjustedStart = totalPages - 3;
      }
      
      for (let i = adjustedStart; i <= adjustedEnd; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }
      
      if (page < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-[10px] border border-border shadow-sm">
      <div className="text-sm text-muted-foreground text-center sm:text-left">
        Showing page <span className="font-semibold text-foreground">{page}</span> of{' '}
        <span className="font-semibold text-foreground">{totalPages}</span>{' '}
        <span className="text-xs">({totalLogs} total logs)</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || loading}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-background border border-input rounded-[8px] text-sm hover:bg-secondary text-secondary-foreground disabled:opacity-40 disabled:pointer-events-none transition-all"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden md:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm font-medium select-none"
                >
                  &bull;&bull;&bull;
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === page;

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                disabled={loading || isActive}
                className={`w-9 h-9 flex items-center justify-center rounded-[8px] text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm pointer-events-none'
                    : 'bg-background border border-input hover:bg-secondary text-secondary-foreground hover:scale-105 active:scale-95'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || loading}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-background border border-input rounded-[8px] text-sm hover:bg-secondary text-secondary-foreground disabled:opacity-40 disabled:pointer-events-none transition-all"
          title="Next Page"
        >
          <span className="hidden md:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
