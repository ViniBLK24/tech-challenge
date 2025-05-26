import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
          Anterior
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Logic to show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              // If 5 or fewer pages, show all
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              // If near start, show first 5 pages
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // If near end, show last 5 pages
              pageNum = totalPages - 4 + i;
            } else {
              // Otherwise show 2 before and 2 after current page
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          {/* Show ellipsis if there are more pages */}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className="px-1">...</span>
          )}

          {/* Always show last page if not in view */}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <Button
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Próxima
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}