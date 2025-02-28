import {
  Pagination as ShadCNPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/shadcn/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DEFAULT_START_PAGE_NUMBER = 1;

export const Pagination = (props: PaginationProps) => {
  const { currentPage, totalPages, onPageChange } = props;

  const renderPages = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(
          <PaginationItem key={i + 1}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(i)}
              isActive={i === currentPage}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      if (startPage > 0) {
        pages.push(
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(0)}
              isActive={currentPage === 0}
            >
              {DEFAULT_START_PAGE_NUMBER}
            </PaginationLink>
          </PaginationItem>
        );
        if (startPage > 1) {
          pages.push(
            <PaginationItem key="start-ellipsis">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i + 1}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(i)}
              isActive={i === currentPage}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
          pages.push(
            <PaginationItem key="end-ellipsis">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(totalPages - 1)}
              isActive={currentPage === totalPages - 1}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  const onPreviousClick = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const onNextClick = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <ShadCNPagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={onPreviousClick} />
          </PaginationItem>
          {renderPages()}
          <PaginationItem>
            <PaginationNext href="#" onClick={onNextClick} />
          </PaginationItem>
        </PaginationContent>
      </ShadCNPagination>
    </div>
  );
};
