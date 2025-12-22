# React Split-Row Table

A generic React table component designed to render complex row layouts (like "sandwich" rows) without hardcoding structure. It supports spanning columns vertically across multiple visual rows per data item.

## Features

- **Configurable Layout:** Control cell placement (`main`, `sub`, `both`) via column definitions.
    
- **Vertical Spanning:** Easily create "Action" or "ID" columns that span the full height of the row group.
    
- **Flat Data Structure:** Handles complex visuals while keeping your data array simple.
    

## Usage

### The "Sandwich" Layout

This example creates a layout where **ID** and **Actions** span vertically, **Data** sits on top, and a **Note** sits underneath.

TypeScript

```
import { Table } from './Table';

const MyComponent = () => {
  const data = [
    { id: 1, date: '2023-10-01', item: 'Apple', note: 'Warning: Perishable', status: 'Active' },
    { id: 2, date: '2023-10-05', item: 'Banana', note: 'Check stock', status: 'Pending' },
  ];

  const columns = [
    // 1. Spans Vertical (Left side)
    { key: 'id', header: 'ID', rowType: 'both' },

    // 2. Top Row (Middle)
    { key: 'date', header: 'Date', rowType: 'main' },
    { key: 'item', header: 'Item', rowType: 'main' },

    // 3. Spans Vertical (Right side)
    { key: 'status', header: 'Status', rowType: 'both' },

    // 4. Bottom Row (The Note)
    // MUST calculate colSpan: (Total Columns - 'Both' Columns)
    { 
      key: 'note', 
      header: 'Notes', 
      rowType: 'sub',
      render: (row) => <em>{row.note}</em>,
      cellProps: () => ({ colSpan: 2, style: { background: '#f9f9f9' } })
    }
  ];

  return <Table columns={columns} data={data} />;
};
```

## API Reference

### `Column` Configuration

| **Property** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| `key` | `string` | **Required** | Unique identifier for the data field. |
| `header` | `string` | **Required** | Display text for the table header. |
| `rowType` | `'main' \| 'sub' \| 'both'` | `'main'` | **`main`**: Renders in the top row.  <br><br/><br/><br/>**`sub`**: Renders in the bottom row.  <br><br/><br/><br/>**`both`**: Spans vertically (`rowSpan=2`). |
| `render` | `(row) => ReactNode` | `null` | Custom render function. |
| `cellProps` | `(row) => object` | `null` | dynamic props for `<td>` (e.g., `colSpan`, `className`). |

### `rowType` Visual Guide

Plaintext

```
+------+-----------------------------+------+
|      |      rowType: 'main'        |      |
| both |-----------------------------| both |
|      |      rowType: 'sub'         |      |
+------+-----------------------------+------+
```

## Styling Tips

To make the split rows look like a single unified item, remove the internal borders in your CSS Module:

CSS

```
/* Table.module.css */

/* Remove border between the Top and Bottom row */
.table tr:nth-child(odd) td {
  border-bottom: none;
}

/* Optional: Add spacing or background to the Bottom (Note) row */
.table tr:nth-child(even) td {
  border-top: none;
  padding-top: 0;
  color: #666;
}
```