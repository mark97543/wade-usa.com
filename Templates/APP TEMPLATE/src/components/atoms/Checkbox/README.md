## ⚛️ Checkbox Component (`Checkbox.tsx`)

| **Detail**  | **Value**                                                   |
| ----------- | ----------------------------------------------------------- |
| **Path**    | `src/components/atoms/Checkbox/Checkbox.tsx`                |
| **Type**    | Atom (Basic Element)                                        |
| **Purpose** | A theme-aware, accessible checkbox input element for forms. |

------

## 1. Overview and Philosophy

The `<Checkbox>` component is a foundational form element that encapsulates the native `<input type="checkbox">` within a theme-aware label structure. It abstracts complex styling to present a uniform, brand-consistent control across the application, adhering to the project's **Atomic Design** principles.

**Import:**

JavaScript

```
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox';
```

------

## 2. Props API (`CheckboxProps`)

This component extends all standard HTML `<input>` attributes (`InputHTMLAttributes`) but explicitly requires several key props for accessibility, form submission, and proper rendering.

| **Prop**    | **Type**              | **Required** | **Description**                                              |
| ----------- | --------------------- | ------------ | ------------------------------------------------------------ |
| **`label`** | `string`              | **Yes**      | The visible text displayed next to the checkbox. This is essential for user context and screen readers. |
| **`id`**    | `string`              | **Yes**      | A unique ID that links the `<label>` element to the `<input>` element (crucial for accessibility). |
| **`name`**  | `string`              | **Yes**      | The name attribute used when submitting form data.           |
| **`value`** | `string`              | **Yes**      | The value sent to the server when the form is submitted and the checkbox is checked. |
| `checked`   | `boolean`             | No           | Controls the checked state of the input.                     |
| `onChange`  | `(event) => void`     | No           | The function called when the checkbox state changes.         |
| `...props`  | `InputHTMLAttributes` | No           | Accepts all other standard HTML input attributes (e.g., `disabled`, `data-testid`). |

------

## 3. Usage Guide

The `<Checkbox>` is typically wrapped in a parent component that manages its `checked` state and handles the `onChange` event (e.g., a form or a state-managed table cell).

### Standard Usage (In a Form)

TypeScript

```
import { useState } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox';

export const SettingsForm = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <Checkbox
      id="newsletter-optin"
      name="optin"
      value="true"
      label="Subscribe to our quarterly newsletter"
      checked={isSubscribed}
      onChange={() => setIsSubscribed(!isSubscribed)}
    />
  );
};
```

### Advanced Usage (Inside a Table Cell)

When used inside the `<Table>` component, the `id` and `value` must be unique and derived from the row data (e.g., the row's primary key/ID).

TypeScript

```
// Example from a parent component defining a table column
const documentColumns = [
  // ... other columns
  { 
    key: 'is_paid', 
    header: 'Paid', 
    render: (row) => (
      <Checkbox
        id={`paid-${row.id}`}
        name="paid_status"
        value={String(row.id)} // Use the row ID as the value
        label="" // Label is intentionally empty since the table header provides context
        checked={row.paid}
        onChange={(e) => handlePaidStatusChange(row.id, e.target.checked)}
      />
    ),
  },
];
```