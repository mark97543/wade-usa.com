# Button

A versatile, theme-aware interactive button component. It supports multiple visual variants, sizing options, and an integrated loading state with a spinner.

## Features

- **Variants**: Supports three distinct visual styles: `primary`, `outline`, and `danger`.
    
- **Sizing**: Available in `sm` (small), `md` (medium), and `lg` (large).
    
- **Loading State**: Built-in support for `isLoading`. When active, it disables the button and displays a `Spinner` (automatically sized to match the button).
    
- **Accessibility**: Correctly handles the `disabled` attribute and passes standard HTML button props.
    

## Usage

TypeScript

```
import { Button } from './components/atoms/Button/Button';

const ActionPanel = () => {
  const handleSubmit = () => {
    // Handle click
  };

  return (
    <div className="actions">
      {/* 1. Default Primary Button */}
      <Button onClick={handleSubmit}>
        Save Changes
      </Button>

      {/* 2. Secondary/Outline Button */}
      <Button variant="outline" onClick={() => console.log('Cancel')}>
        Cancel
      </Button>

      {/* 3. Destructive Action */}
      <Button variant="danger" size="sm">
        Delete
      </Button>

      {/* 4. Loading State */}
      <Button isLoading={true}>
        Processing...
      </Button>
      
      {/* 5. Large Button */}
      <Button size="lg">
        Get Started
      </Button>
    </div>
  );
};
```

## Props

The component extends `React.ButtonHTMLAttributes<HTMLButtonElement>`, allowing you to pass standard attributes like `type`, `onClick`, `form`, etc.

| **Prop Name** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'outline' \| 'danger'` | `'primary'` | Controls the color and visual style of the button. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls the padding and font size. |
| `isLoading` | `boolean` | `false` | If true, shows a spinner and disables interactions. |
| `disabled` | `boolean` | `false` | Standard HTML disabled attribute. (Automatically true if `isLoading` is set). |
| `className` | `string` | \-  | Additional CSS classes to apply. |
| `children` | `ReactNode` | \-  | The content inside the button (text, icons, etc.). |

## Styling

The component uses `Button.module.css`.

- **Base Style**: `.btn` sets the core layout (flexbox), border radius, and transitions.
    
- **Variants**: `.primary`, `.outline`, and `.danger` control colors and borders.
    
- **Sizes**: `.sm`, `.md`, and `.lg` control padding and font sizing.
    
- **Loading**: The spinner is styled via `.spinner`. Note that `sm` buttons use a small spinner, while `md` and `lg` buttons use the medium spinner.