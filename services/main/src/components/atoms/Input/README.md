# Input

A flexible, accessible, and theme-aware input wrapper. This component extends the standard HTML `<input>` element, adding built-in support for labels, error messaging, and consistent application styling.

## Features

- **Standard Attributes**: Accepts all standard React HTML input attributes (e.g., `type`, `value`, `onChange`, `placeholder`, `disabled`).
    
- **Integrated Label**: Automatically renders a `<label>` element linked to the input via `id` or `name`.
    
- **Error Handling**: Displays validation error messages below the field and applies error-specific styling (e.g., red borders) to the input.
    
- **Auto-ID Generation**: If no `id` is provided, it attempts to use the `name` prop to link the label and input for accessibility.
    

## Usage

TypeScript

```
import { useState } from 'react';
import { Input } from './components/atoms/Input/Input';

const LoginForm = () => {
  const [email, setEmail] = useState('');

  return (
    <form>
      {/* 1. Basic Text Input */}
      <Input 
        placeholder="Enter your username" 
      />

      {/* 2. Input with Label and Type */}
      <Input 
        label="Email Address" 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* 3. Input with Error State */}
      <Input 
        label="Password" 
        type="password" 
        error="Password must be at least 8 characters" 
      />
    </form>
  );
};
```

## Props

The component extends `React.InputHTMLAttributes<HTMLInputElement>`, meaning it accepts **all** standard input properties. The specific custom props are listed below:

| **Prop Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `label` | `string` | No  | Text displayed above the input field. |
| `error` | `string` | No  | Validation error message displayed below the input. If present, the input border changes color. |
| `id` | `string` | No  | Unique identifier. If omitted, the component falls back to `name`. |
| `className` | `string` | No  | Additional CSS classes to apply to the container. |
| `...props` | `HTMLAttributes` | No  | Standard props like `type`, `value`, `onChange`, `placeholder`, `readOnly`, etc. |

## Styling

The component uses `Input.module.css` for encapsulation.

- **Container**: Flex column layout to stack label, input, and error message.
    
- **Label**: Styled with `styles.label`.
    
- **Input**: Base styling applied via `styles.input`. If the `error` prop is present, `styles.errorInput` is conditionally appended.
    
- **Error Message**: Rendered in a `span` using `styles.errorMessage`.