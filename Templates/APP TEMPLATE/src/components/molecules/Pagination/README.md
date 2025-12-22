# Pagination Component

Path: src/components/molecules/Pagination/Pagination.tsx

Type: Molecule

Styles: Pagination.module.css

## 1. Overview

The `Pagination` component provides navigation controls for multi-page content (tables, lists, grids). It includes logic to intelligently truncation long lists of pages with ellipses (`...`), ensuring the user interface remains clean regardless of the total page count.

**Key Features:**

- **Smart Truncation:** Automatically calculates when to show ellipses based on the current page.
- **Edge Navigation:** Always displays the First (1) and Last (N) pages.
- **Accessibility:** Includes `aria-label` and `aria-current` attributes for screen readers.
- **Auto-Hide:** Renders `null` (nothing) if `totalPages` is 1 or less.

## 2. Props Interface

| **Prop**       | **Type**                 | **Default**  | **Description**                                              |
| -------------- | ------------------------ | ------------ | ------------------------------------------------------------ |
| `currentPage`  | `number`                 | **Required** | The currently active page index (1-based).                   |
| `totalPages`   | `number`                 | **Required** | The total count of available pages.                          |
| `onPageChange` | `(page: number) => void` | **Required** | Callback function fired when a specific page number, Next, or Prev is clicked. |
| `pageRange`    | `number`                 | `1`          | The number of sibling buttons to display on either side of the current page. |

## 3. Usage Examples

### Basic Usage

TypeScript

```
import { useState } from 'react';
import { Pagination } from '@/components/molecules/Pagination/Pagination';

const MyList = () => {
  const [page, setPage] = useState(1);
  const total = 10;

  return (
    <div>
      {/* Content goes here... */}
      
      <Pagination 
        currentPage={page} 
        totalPages={total} 
        onPageChange={(newPage) => setPage(newPage)} 
      />
    </div>
  );
};
```

### Adjusting the Range

By setting `pageRange={2}`, you increase the visibility around the active page.

Scenario: Current Page: 50, Total: 100, Range: 2.

Result: [Prev] 1 ... 48 49 [50] 51 52 ... 100 [Next]

TypeScript

```
<Pagination 
  currentPage={50} 
  totalPages={100} 
  onPageChange={handlePageChange}
  pageRange={2} 
/>
```

## 4. Logic & Behavior

The component uses a helper function `getPageNumbers` to generate the view array.

1. **Start/End Guards:** Page 1 and the Last Page are always visible.
2. **Ellipses:**
   - If the gap between Page 1 and the start of your range is greater than 1, an ellipsis is added.
   - If the gap between the end of your range and the Last Page is greater than 1, an ellipsis is added.
3. **Buttons:**
   - **Prev:** Disabled if `currentPage <= 1`.
   - **Next:** Disabled if `currentPage >= totalPages`.
   - **Active Page:** Disabled (non-clickable) to prevent redundant state updates.

## 5. CSS Styling

The component relies on a CSS Module (`Pagination.module.css`). You will need to create this file to style the buttons.

**Suggested Class Names:**

- `.paginationContainer`: The flex container `<nav>`.
- `.pageButton`: Base style for numbers, Next, and Prev.
- `.active`: Modifier for the currently selected page.
- `.ellipsis`: Style for the `...` text (non-clickable).

## Usage Example

```react
import React, { useState } from 'react';
import { Pagination } from './Pagination';

const MyList = () => {
  const [page, setPage] = useState(1);
  const totalItems = 100;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Fetch new data here based on newPage
  };

  return (
    <div>
      <ul>
        {/* Render your list items for the current page here */}
      </ul>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageRange={1} // Optional: Shows [Prev, 1 ... 4, 5, 6 ... 10, Next] if on page 5
      />
    </div>
  );
};

```

