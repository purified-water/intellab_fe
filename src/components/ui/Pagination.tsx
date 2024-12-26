

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = (props: PaginationProps) => {
  const { currentPage, totalPages, onPageChange } = props;
  console.log(currentPage, totalPages);

  const renderPages = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i + 1}
          onClick={() => onPageChange(i)}
          disabled={i === currentPage}
          className={`px-4 py-2 mx-1 ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-4 py-2 mx-2 bg-gray-300 rounded"
      >
        {"<"}
      </button>
      {renderPages()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-4 py-2 mx-2 bg-gray-300 rounded"
      >
        {">"}
      </button>
    </div>
  );
};

export default Pagination;