import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const visiblePages = 4; // Maximum number of visible pages

  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`px-3 py-1 mx-1 rounded hover:bg-blue-500 hover:text-white ${
        currentPage === page
          ? "bg-blue-700 text-white font-bold"
          : "bg-gray-200 text-black hover:bg-gray-300"
      }`}
    >
      {page}
    </button>
  );

  const renderPagination = () => {
    const pages = [];

    // Calculate startPage and endPage
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    // Add first page and "..." if needed
    if (startPage > 1) {
      pages.push(renderPageButton(1));
      if (startPage > 2) {
        pages.push(<span key="dots-start">...</span>);
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(renderPageButton(i));
    }

    // Add last page and "..." if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-end">...</span>);
      }
      pages.push(renderPageButton(totalPages));
    }

    return pages;
  };

  return <div className="flex justify-center items-center mt-4">{renderPagination()}</div>;
};

export default Pagination;
