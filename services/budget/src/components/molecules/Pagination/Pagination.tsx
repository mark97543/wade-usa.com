// services/main/src/components/molecules/Pagination/Pagination.tsx

import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Number of page buttons to show around the current page (e.g., 1 for [Prev, 4, 5, 6, Next]) */
  pageRange?: number; 
}

/**
 * Generates an array of visible page numbers, including ellipses.
 * @param currentPage The current active page number.
 * @param totalPages The total number of pages available.
 * @param range The number of pages to show around the current one.
 * @returns An array of numbers or the string '...'
 */
const getPageNumbers = (currentPage: number, totalPages: number, range: number) => {
  const pages: (number | string)[] = [];
  const startPage = Math.max(2, currentPage - range);
  const endPage = Math.min(totalPages - 1, currentPage + range);

  // Always show page 1
  if (totalPages > 0) {
    pages.push(1);
  }

  // Ellipsis after page 1
  if (startPage > 2) {
    pages.push('...');
  }

  // Intermediate pages
  for (let i = startPage; i <= endPage; i++) {
    if (i !== 1 && i !== totalPages) {
        pages.push(i);
    }
  }

  // Ellipsis before last page
  if (endPage < totalPages - 1) {
    pages.push('...');
  }

  // Always show last page (if totalPages > 1)
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  // Deduplicate and filter (in case 1 and startPage overlap, or endPage and totalPages overlap)
  return Array.from(new Set(pages));
};


/**
 * A theme-aware pagination component for navigating multi-page content.
 */
export const Pagination = ({ currentPage, totalPages, onPageChange, pageRange = 1 }: PaginationProps) => {

  //This will make the pagenation disapear if pages less than one. In this case we are commenting out 
  // There will never be less than one page in this app and its messing with the page themeing. 
  // if (totalPages <= 1) {
  //   return null;
  // }

  const pages = getPageNumbers(currentPage, totalPages, pageRange);

  const renderPageButton = (page: number | string) => {
    if (page === '...') {
      return <span key={Math.random()} className={styles.ellipsis}>...</span>;
    }

    const pageNumber = page as number;
    const isActive = pageNumber === currentPage;

    return (
      <button
        key={pageNumber}
        onClick={() => onPageChange(pageNumber)}
        className={`${styles.pageButton} ${isActive ? styles.active : ''}`}
        aria-current={isActive ? 'page' : undefined}
        disabled={isActive}
        type="button"
      >
        {pageNumber}
      </button>
    );
  };

  return (
    <nav className={styles.paginationContainer} aria-label="Pagination Navigation">
      
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={styles.pageButton}
        aria-label="Previous Page"
        type="button"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map(renderPageButton)}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={styles.pageButton}
        aria-label="Next Page"
        type="button"
      >
        Next
      </button>
    </nav>
  );
};