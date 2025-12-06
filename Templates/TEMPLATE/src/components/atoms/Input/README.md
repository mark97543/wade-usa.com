## ⚛️ Input Component (`Input.tsx`)

| **Detail**  | **Value**                                                    |
| ----------- | ------------------------------------------------------------ |
| **Path**    | `src/components/atoms/Input/Input.tsx`                       |
| **Type**    | Atom (Basic Element)                                         |
| **Purpose** | A theme-aware, standardized text input field that includes integrated error and label display. |

------

## 1. Overview and Philosophy

The `<Input>` component is the primary data entry element, designed to handle user input while automatically integrating form labels and error messages. It utilizes CSS modules to adopt the global theme and is structured to pass through all standard HTML input properties for maximum flexibility.

**Import:**

JavaScript

```
import { Input } from '@/components/atoms/Input/Input';
```

------

## 2. Props API (`InputProps`)

The component extends standard `React.InputHTMLAttributes<HTMLInputElement>` and adds three custom props for structural display.

| **Prop**   | **Type**              | **Description**                                              |
| ---------- | --------------------- | ------------------------------------------------------------ |
| `label`    | `string`              | **Optional.** Text displayed above the input field as a visual identifier. |
| `error`    | `string`              | **Optional.** If present, the input border turns red (`--danger-color`), and the error message is displayed below the field. |
| `id`       | `string`              | **Optional.** Unique ID for the input. If omitted, it defaults to the `name` prop for accessibility (connecting label via `htmlFor`). |
| `...props` | `InputHTMLAttributes` | Accepts all standard HTML input props (e.g., `type`, `placeholder`, `value`, `onChange`, `required`). |

------

## 3. Theming and Usage

### Theming Integration

The component is fully theme-aware:

- **Background:** Uses `var(--surface-color)`.
- **Text/Color:** Uses `var(--primary-color)`.
- **Focus:** Highlights the border with `var(--accent-color)`.
- **Error:** Highlights the border and text with `var(--danger-color)`.

### Usage Examples

TypeScript

```
// 1. Input with Label and Error State
<Input 
  label="Email Address" 
  id="user-email"
  type="email" 
  placeholder="you@wade-usa.com" 
  error="This email is not valid."
/>

// 2. Standard Password Input (no custom props)
<Input 
  type="password" 
  placeholder="••••••••" 
  required
/>
```

> 💡 **Best Practice:** When creating complex forms, wrap the `<Input>` component inside the `<FormGroup>` molecule. This component standardizes the spacing and layout for input fields.