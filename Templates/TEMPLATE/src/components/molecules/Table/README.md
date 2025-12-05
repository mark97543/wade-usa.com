## 📊 Table Component (`Table.tsx`)

| **Detail**  | **Value**                                                    |
| ----------- | ------------------------------------------------------------ |
| **Path**    | `src/components/molecules/Table/Table.tsx`                   |
| **Type**    | Molecule (Compound Component)                                |
| **Purpose** | Displays structured data in a responsive, theme-aware grid with optional row interaction. |

------

## 1. Overview and Usage

The `<Table>` component is a responsive data grid designed to display an array of objects. It automatically handles the column mapping and implements theme-aware styling, including striped rows and hover effects.

**Import:**

JavaScript

```
import { Table } from '@/components/molecules/Table/Table';
```

**Example Usage:**

TypeScript

```
import { Table } from '@/components/molecules/Table/Table';

const employeeColumns = [
  { key: 'name', header: 'Employee Name' },
  { key: 'role', header: 'Job Title' },
  { key: 'status', header: 'Status' }
];

const employeeData = [
  { name: 'Wade Wilson', role: 'Mercenary', status: 'Active' },
  { name: 'Peter Parker', role: 'Photographer', status: 'Active' },
  { name: 'Tony Stark', role: 'Engineer', status: 'Retired' }
];

return (
  <Table 
    columns={employeeColumns} 
    data={employeeData} 
    onRowClick={(row) => alert(`Clicked data for ${row.name}`)} 
  />
);
```

------

## 2. Props API (`TableProps`)

| **Prop**      | **Type**              | **Description**                                              |
| ------------- | --------------------- | ------------------------------------------------------------ |
| **`columns`** | `Column[]`            | **Required.** An array defining the table structure. Each object needs a `key` (matching the data field) and a `header` (display text). |
| **`data`**    | `any[]`               | **Required.** An array of data objects. The property names must match the `key` values defined in the `columns` array. |
| `onRowClick`  | `(item: any) => void` | **Optional.** A function that executes when any table row is clicked. The full row object is passed to this function. |

### `Column` Interface

TypeScript

```
interface Column {
  key: string;    // Property name in the data object
  header: string; // Text for the table header
}
```

------

## 3. Theming and Styling

The table uses CSS Modules to ensure it follows the application's global theme settings.

- **Background:** The table uses the theme's surface color (`--surface-color`) for its background.
- **Headers:** Table headers (`<th>`) are styled using the brand's accent color (`--accent-color`).
- **Striping:** Rows are automatically striped by applying a subtle background color to every even row (`tr:nth-child(even)`) for readability.
- **Responsiveness:** The component is wrapped in a container with `overflow-x: auto` to prevent horizontal overflow on smaller screens.