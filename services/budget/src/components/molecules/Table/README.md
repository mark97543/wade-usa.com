- ## 📊 Table Component (`Table.tsx`) - Updated

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
  | **`columns`** | `Column[]`            | **Required.** An array defining the table structure. Each object needs a `key` and a `header`. **(Now supports a custom `render` function. See Section 4).** |
  | **`data`**    | `any[]`               | **Required.** An array of data objects. The property names must match the `key` values defined in the columns array. |
  | `onRowClick`  | `(item: any) => void` | **Optional.** A function that executes when any table row is clicked. The full row object is passed to this function. |

  ### `Column` Interface (Updated)

  The `Column` interface has been expanded to allow a custom rendering function for maximum flexibility.

  TypeScript

  ```
  interface Column {
    key: string;    // Property name in the data object
    header: string; // Text for the table header
    // NEW: Allows rendering custom JSX (Checkbox, Button, Icon, etc.)
    render?: (row: any) => React.ReactNode; 
  }
  ```

  ------

  ## 3. Theming and Styling

  The table uses CSS Modules to ensure it follows the application's global theme settings.

  - **Background:** The table uses the theme's surface color (`--surface-color`) for its background.
  - **Headers:** Table headers (`<th>`) are styled using the brand's accent color (`--accent-color`).
  - **Striping:** Rows are automatically striped by applying a subtle background color to every even row (`tr:nth-child(even)`) for readability.
  - **Responsiveness:** The component is wrapped in a container with `overflow-x: auto` to prevent horizontal overflow on smaller screens.

  ------

  ## 4. Advanced Usage: Custom Renderers

  The optional `render` function allows you to insert any piece of JSX, including your custom components, into a column. This keeps the `<Table>` component clean and decouples its display from your component library's business logic.

  **Key Principle:** The parent component **must** import the custom element (e.g., `<CustomCheckbox>`) and use it within the `render` function closure.

  TypeScript

  ```
  // Inside your parent page component (e.g., DocumentPage.tsx)
  
  import { CustomCheckbox } from '@/components/atoms/Checkbox/CustomCheckbox'; // Your custom component
  import { Button } from '@/components/atoms/Button/Button'; 
  
  // ... data setup ...
  
  const advancedColumns = [
    // COLUMN 1: Custom Checkbox
    { 
      key: 'selector', 
      header: '', 
      render: (row) => (
        // You must import and use your custom component here
        <CustomCheckbox 
          checked={row.is_selected} 
          onChange={(e) => handleToggle(row.id, e.target.checked)}
        />
      ),
    },
    // COLUMN 2: Standard Data
    { key: 'title', header: 'Document' },
    // COLUMN 3: Custom Button (Action)
    {
      key: 'actions', 
      header: 'Actions',
      render: (row) => (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleEdit(row.id)}
        >
          Edit
        </Button>
      )
    }
  ];
  
  return <Table columns={advancedColumns} data={data} />;
  ```