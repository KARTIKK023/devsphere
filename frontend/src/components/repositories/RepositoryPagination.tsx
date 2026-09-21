import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface RepositoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function RepositoryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: RepositoryPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t pt-4">
      {/* Results */}
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
        >
          <ChevronLeft className="size-4" />

          <span className="sr-only">
            Previous page
          </span>
        </Button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <Button
            key={page}
            variant={
              page === currentPage
                ? "default"
                : "outline"
            }
            size="icon"
            className="size-8"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange(currentPage + 1)
          }
        >
          <ChevronRight className="size-4" />

          <span className="sr-only">
            Next page
          </span>
        </Button>
      </div>
    </div>
  );
}